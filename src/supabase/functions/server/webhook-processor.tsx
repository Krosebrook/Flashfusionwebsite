import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from './cors.ts';
import * as crypto from 'https://deno.land/std@0.168.0/crypto/mod.ts';

interface WebhookEvent {
  id: string;
  type: string;
  source: 'github' | 'gitlab' | 'internal' | 'deployment';
  timestamp: string;
  payload: any;
  signature?: string;
  processed: boolean;
  retryCount: number;
  processingLog: string[];
}

interface ProcessingResult {
  success: boolean;
  message: string;
  actions: string[];
  errors?: string[];
}

/**
 * Webhook Event Processor
 * 
 * Handles incoming webhooks from GitHub, GitLab, deployments, and internal FlashFusion events.
 * Provides real-time updates, automatic repository analysis, and team notifications.
 */
class WebhookProcessor {
  private supabase: any;
  
  constructor() {
    this.supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
  }

  /**
   * Verify webhook signature for security
   */
  private async verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
    try {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      const expectedSignature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
      const expectedHex = Array.from(new Uint8Array(expectedSignature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      const providedSignature = signature.replace('sha256=', '');
      return providedSignature === expectedHex;
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  /**
   * Process GitHub webhook events
   */
  private async processGitHubWebhook(event: WebhookEvent): Promise<ProcessingResult> {
    const { type, payload } = event;
    const actions: string[] = [];
    const errors: string[] = [];

    try {
      switch (type) {
        case 'push':
          return await this.handleGitHubPush(payload, actions);
        
        case 'pull_request':
          return await this.handleGitHubPullRequest(payload, actions);
        
        case 'issues':
          return await this.handleGitHubIssues(payload, actions);
        
        case 'release':
          return await this.handleGitHubRelease(payload, actions);
        
        case 'deployment_status':
          return await this.handleGitHubDeployment(payload, actions);
        
        case 'workflow_run':
          return await this.handleGitHubWorkflow(payload, actions);
        
        default:
          return {
            success: true,
            message: `GitHub ${type} event received but not processed`,
            actions: ['logged']
          };
      }
    } catch (error) {
      errors.push(`GitHub processing error: ${error.message}`);
      return { success: false, message: 'GitHub webhook processing failed', actions, errors };
    }
  }

  /**
   * Handle GitHub push events
   */
  private async handleGitHubPush(payload: any, actions: string[]): Promise<ProcessingResult> {
    const repository = payload.repository;
    const commits = payload.commits || [];
    const branch = payload.ref.replace('refs/heads/', '');

    // Update repository information
    await this.updateRepositoryInfo(repository, branch);
    actions.push('repository_updated');

    // Trigger AI re-analysis if significant changes
    if (commits.length > 0) {
      const significantFiles = commits.flatMap((commit: any) => 
        [...(commit.added || []), ...(commit.modified || [])]
      );
      
      if (this.hasSignificantChanges(significantFiles)) {
        await this.triggerRepositoryAnalysis(repository.clone_url, branch);
        actions.push('analysis_triggered');
      }
    }

    // Notify team members
    await this.notifyTeamMembers(repository.full_name, 'push', {
      branch,
      commits: commits.length,
      pusher: payload.pusher?.name || 'Unknown'
    });
    actions.push('team_notified');

    return {
      success: true,
      message: `Processed ${commits.length} commits on ${branch} branch`,
      actions
    };
  }

  /**
   * Handle GitHub pull request events
   */
  private async handleGitHubPullRequest(payload: any, actions: string[]): Promise<ProcessingResult> {
    const pr = payload.pull_request;
    const action = payload.action;
    const repository = payload.repository;

    // Update PR information
    await this.updatePullRequestInfo(pr, repository);
    actions.push('pr_updated');

    // Trigger code review analysis for new PRs
    if (action === 'opened' || action === 'synchronize') {
      await this.triggerCodeReviewAnalysis(pr);
      actions.push('code_review_triggered');
    }

    // Auto-assign reviewers based on changed files
    if (action === 'opened') {
      const reviewers = await this.getRecommendedReviewers(pr.changed_files);
      if (reviewers.length > 0) {
        // In a real implementation, this would call GitHub API to assign reviewers
        actions.push('reviewers_assigned');
      }
    }

    // Notify team members
    await this.notifyTeamMembers(repository.full_name, 'pull_request', {
      action,
      title: pr.title,
      author: pr.user?.login || 'Unknown',
      url: pr.html_url
    });
    actions.push('team_notified');

    return {
      success: true,
      message: `Processed PR ${action}: ${pr.title}`,
      actions
    };
  }

  /**
   * Handle GitHub issues events
   */
  private async handleGitHubIssues(payload: any, actions: string[]): Promise<ProcessingResult> {
    const issue = payload.issue;
    const action = payload.action;
    const repository = payload.repository;

    // Update issue information
    await this.updateIssueInfo(issue, repository);
    actions.push('issue_updated');

    // Auto-label issues based on content analysis
    if (action === 'opened') {
      const suggestedLabels = await this.analyzeIssueForLabels(issue);
      if (suggestedLabels.length > 0) {
        // In a real implementation, this would call GitHub API to add labels
        actions.push('labels_suggested');
      }
    }

    // Notify team members
    await this.notifyTeamMembers(repository.full_name, 'issue', {
      action,
      title: issue.title,
      author: issue.user?.login || 'Unknown',
      url: issue.html_url
    });
    actions.push('team_notified');

    return {
      success: true,
      message: `Processed issue ${action}: ${issue.title}`,
      actions
    };
  }

  /**
   * Handle GitHub release events
   */
  private async handleGitHubRelease(payload: any, actions: string[]): Promise<ProcessingResult> {
    const release = payload.release;
    const action = payload.action;
    const repository = payload.repository;

    if (action === 'published') {
      // Update release information
      await this.updateReleaseInfo(release, repository);
      actions.push('release_updated');

      // Trigger deployment workflows
      await this.triggerDeploymentWorkflows(repository, release);
      actions.push('deployment_triggered');

      // Update project documentation
      await this.updateProjectDocumentation(repository, release);
      actions.push('documentation_updated');

      // Notify team and stakeholders
      await this.notifyRelease(repository.full_name, release);
      actions.push('stakeholders_notified');
    }

    return {
      success: true,
      message: `Processed release ${action}: ${release.tag_name}`,
      actions
    };
  }

  /**
   * Handle GitHub deployment events
   */
  private async handleGitHubDeployment(payload: any, actions: string[]): Promise<ProcessingResult> {
    const deployment = payload.deployment_status;
    const repository = payload.repository;

    // Update deployment status
    await this.updateDeploymentStatus(deployment, repository);
    actions.push('deployment_status_updated');

    // Trigger post-deployment analysis for successful deployments
    if (deployment.state === 'success') {
      await this.triggerPostDeploymentAnalysis(deployment, repository);
      actions.push('post_deployment_analysis');
    }

    // Notify team about deployment status
    await this.notifyTeamMembers(repository.full_name, 'deployment', {
      state: deployment.state,
      environment: deployment.environment,
      url: deployment.target_url
    });
    actions.push('team_notified');

    return {
      success: true,
      message: `Processed deployment status: ${deployment.state}`,
      actions
    };
  }

  /**
   * Handle GitHub workflow events
   */
  private async handleGitHubWorkflow(payload: any, actions: string[]): Promise<ProcessingResult> {
    const workflow = payload.workflow_run;
    const repository = payload.repository;

    // Update workflow status
    await this.updateWorkflowStatus(workflow, repository);
    actions.push('workflow_status_updated');

    // Analyze workflow performance and suggest optimizations
    if (workflow.status === 'completed') {
      await this.analyzeWorkflowPerformance(workflow);
      actions.push('workflow_analyzed');
    }

    return {
      success: true,
      message: `Processed workflow: ${workflow.name} - ${workflow.status}`,
      actions
    };
  }

  /**
   * Process internal FlashFusion events
   */
  private async processInternalWebhook(event: WebhookEvent): Promise<ProcessingResult> {
    const { type, payload } = event;
    const actions: string[] = [];

    try {
      switch (type) {
        case 'project_generated':
          return await this.handleProjectGenerated(payload, actions);
        
        case 'export_completed':
          return await this.handleExportCompleted(payload, actions);
        
        case 'team_member_added':
          return await this.handleTeamMemberAdded(payload, actions);
        
        case 'analysis_completed':
          return await this.handleAnalysisCompleted(payload, actions);
        
        default:
          return {
            success: true,
            message: `Internal ${type} event received but not processed`,
            actions: ['logged']
          };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Internal webhook processing failed',
        actions,
        errors: [error.message]
      };
    }
  }

  /**
   * Handle project generation completion
   */
  private async handleProjectGenerated(payload: any, actions: string[]): Promise<ProcessingResult> {
    // Update project status
    await this.updateProjectStatus(payload.projectId, 'generated');
    actions.push('project_status_updated');

    // Trigger automatic analysis
    await this.triggerProjectAnalysis(payload.projectId);
    actions.push('analysis_triggered');

    // Notify user
    await this.notifyUser(payload.userId, 'project_ready', payload);
    actions.push('user_notified');

    return {
      success: true,
      message: 'Project generation completed successfully',
      actions
    };
  }

  /**
   * Handle export completion
   */
  private async handleExportCompleted(payload: any, actions: string[]): Promise<ProcessingResult> {
    // Update export job status
    await this.updateExportJobStatus(payload.jobId, 'completed', payload.downloadUrl);
    actions.push('export_job_updated');

    // Send download notification
    await this.notifyUser(payload.userId, 'export_ready', payload);
    actions.push('user_notified');

    return {
      success: true,
      message: 'Export completed successfully',
      actions
    };
  }

  /**
   * Handle team member addition
   */
  private async handleTeamMemberAdded(payload: any, actions: string[]): Promise<ProcessingResult> {
    // Update team member status
    await this.updateTeamMemberStatus(payload.teamId, payload.memberId, 'active');
    actions.push('member_status_updated');

    // Send welcome notification
    await this.notifyUser(payload.memberId, 'welcome_to_team', payload);
    actions.push('welcome_sent');

    // Notify team about new member
    await this.notifyTeam(payload.teamId, 'member_joined', payload);
    actions.push('team_notified');

    return {
      success: true,
      message: 'Team member added successfully',
      actions
    };
  }

  /**
   * Utility functions
   */
  private hasSignificantChanges(files: string[]): boolean {
    const significantExtensions = ['.js', '.ts', '.tsx', '.jsx', '.py', '.java', '.php', '.go', '.rs'];
    const configFiles = ['package.json', 'requirements.txt', 'Dockerfile', '.env'];
    
    return files.some(file => 
      significantExtensions.some(ext => file.endsWith(ext)) ||
      configFiles.some(config => file.includes(config))
    );
  }

  private async updateRepositoryInfo(repository: any, branch: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('repositories')
        .upsert({
          github_id: repository.id,
          name: repository.name,
          full_name: repository.full_name,
          url: repository.clone_url,
          default_branch: branch,
          updated_at: new Date().toISOString(),
          last_push_at: new Date().toISOString()
        }, { onConflict: 'github_id' });

      if (error) {
        console.error('Failed to update repository info:', error);
      }
    } catch (error) {
      console.error('Database error updating repository:', error);
    }
  }

  private async triggerRepositoryAnalysis(repoUrl: string, branch: string): Promise<void> {
    // Trigger AI analysis workflow
    const analysisPayload = {
      repository_url: repoUrl,
      branch: branch,
      timestamp: new Date().toISOString(),
      trigger: 'webhook_push'
    };

    // In a real implementation, this would trigger the analysis service
    console.log('Triggering repository analysis:', analysisPayload);
  }

  private async notifyTeamMembers(repoName: string, eventType: string, data: any): Promise<void> {
    // Send notifications to team members
    const notification = {
      repository: repoName,
      event_type: eventType,
      data: data,
      timestamp: new Date().toISOString()
    };

    // In a real implementation, this would send notifications via email, Slack, etc.
    console.log('Notifying team members:', notification);
  }

  private async updateProjectStatus(projectId: string, status: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('projects')
        .update({
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) {
        console.error('Failed to update project status:', error);
      }
    } catch (error) {
      console.error('Database error updating project:', error);
    }
  }

  private async notifyUser(userId: string, type: string, payload: any): Promise<void> {
    // Send user notification
    const notification = {
      user_id: userId,
      type: type,
      payload: payload,
      timestamp: new Date().toISOString(),
      read: false
    };

    try {
      const { error } = await this.supabase
        .from('notifications')
        .insert(notification);

      if (error) {
        console.error('Failed to create notification:', error);
      }
    } catch (error) {
      console.error('Database error creating notification:', error);
    }
  }

  /**
   * Main webhook processing function
   */
  async processWebhook(request: Request): Promise<Response> {
    try {
      const body = await request.text();
      const headers = Object.fromEntries(request.headers.entries());
      
      // Determine webhook source
      const source = this.determineWebhookSource(headers);
      const eventType = this.extractEventType(headers, source);
      
      // Parse payload
      const payload = JSON.parse(body);
      
      // Verify signature if required
      const signature = headers['x-hub-signature-256'] || headers['x-gitlab-token'];
      if (signature) {
        const secret = Deno.env.get(`${source.toUpperCase()}_WEBHOOK_SECRET`) || '';
        const isValid = await this.verifySignature(body, signature, secret);
        
        if (!isValid) {
          return new Response('Invalid signature', { 
            status: 401,
            headers: corsHeaders 
          });
        }
      }

      // Create webhook event record
      const webhookEvent: WebhookEvent = {
        id: crypto.randomUUID(),
        type: eventType,
        source: source as any,
        timestamp: new Date().toISOString(),
        payload: payload,
        signature: signature,
        processed: false,
        retryCount: 0,
        processingLog: []
      };

      // Process webhook based on source
      let result: ProcessingResult;
      
      switch (source) {
        case 'github':
          result = await this.processGitHubWebhook(webhookEvent);
          break;
        case 'gitlab':
          result = await this.processGitLabWebhook(webhookEvent);
          break;
        case 'internal':
          result = await this.processInternalWebhook(webhookEvent);
          break;
        default:
          result = {
            success: false,
            message: `Unsupported webhook source: ${source}`,
            actions: []
          };
      }

      // Update webhook event with processing result
      webhookEvent.processed = result.success;
      webhookEvent.processingLog.push(result.message);
      
      if (result.errors) {
        webhookEvent.processingLog.push(...result.errors);
      }

      // Store webhook event
      await this.storeWebhookEvent(webhookEvent);

      // Return response
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });

    } catch (error) {
      console.error('Webhook processing error:', error);
      
      return new Response(JSON.stringify({
        success: false,
        message: 'Webhook processing failed',
        error: error.message
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
  }

  private determineWebhookSource(headers: Record<string, string>): string {
    if (headers['x-github-event']) return 'github';
    if (headers['x-gitlab-event']) return 'gitlab';
    if (headers['x-flashfusion-event']) return 'internal';
    return 'unknown';
  }

  private extractEventType(headers: Record<string, string>, source: string): string {
    switch (source) {
      case 'github':
        return headers['x-github-event'] || 'unknown';
      case 'gitlab':
        return headers['x-gitlab-event'] || 'unknown';
      case 'internal':
        return headers['x-flashfusion-event'] || 'unknown';
      default:
        return 'unknown';
    }
  }

  private async processGitLabWebhook(event: WebhookEvent): Promise<ProcessingResult> {
    // Similar to GitHub processing but for GitLab events
    return {
      success: true,
      message: 'GitLab webhook processed',
      actions: ['logged']
    };
  }

  private async storeWebhookEvent(event: WebhookEvent): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('webhook_events')
        .insert({
          id: event.id,
          type: event.type,
          source: event.source,
          timestamp: event.timestamp,
          payload: event.payload,
          processed: event.processed,
          retry_count: event.retryCount,
          processing_log: event.processingLog
        });

      if (error) {
        console.error('Failed to store webhook event:', error);
      }
    } catch (error) {
      console.error('Database error storing webhook event:', error);
    }
  }

  // Placeholder functions for complete implementation
  private async updatePullRequestInfo(pr: any, repository: any): Promise<void> { /* Implementation */ }
  private async triggerCodeReviewAnalysis(pr: any): Promise<void> { /* Implementation */ }
  private async getRecommendedReviewers(changedFiles: any): Promise<string[]> { return []; }
  private async updateIssueInfo(issue: any, repository: any): Promise<void> { /* Implementation */ }
  private async analyzeIssueForLabels(issue: any): Promise<string[]> { return []; }
  private async updateReleaseInfo(release: any, repository: any): Promise<void> { /* Implementation */ }
  private async triggerDeploymentWorkflows(repository: any, release: any): Promise<void> { /* Implementation */ }
  private async updateProjectDocumentation(repository: any, release: any): Promise<void> { /* Implementation */ }
  private async notifyRelease(repoName: string, release: any): Promise<void> { /* Implementation */ }
  private async updateDeploymentStatus(deployment: any, repository: any): Promise<void> { /* Implementation */ }
  private async triggerPostDeploymentAnalysis(deployment: any, repository: any): Promise<void> { /* Implementation */ }
  private async updateWorkflowStatus(workflow: any, repository: any): Promise<void> { /* Implementation */ }
  private async analyzeWorkflowPerformance(workflow: any): Promise<void> { /* Implementation */ }
  private async triggerProjectAnalysis(projectId: string): Promise<void> { /* Implementation */ }
  private async updateExportJobStatus(jobId: string, status: string, downloadUrl?: string): Promise<void> { /* Implementation */ }
  private async updateTeamMemberStatus(teamId: string, memberId: string, status: string): Promise<void> { /* Implementation */ }
  private async notifyTeam(teamId: string, type: string, payload: any): Promise<void> { /* Implementation */ }
  private async handleAnalysisCompleted(payload: any, actions: string[]): Promise<ProcessingResult> { 
    return { success: true, message: 'Analysis completed', actions };
  }
}

// Main webhook handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  const processor = new WebhookProcessor();
  return await processor.processWebhook(req);
});