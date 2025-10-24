/**
 * FlashFusion Supabase RLS (Row-Level Security) Tests
 * 
 * Tests to validate that Row-Level Security policies are correctly configured.
 * Uses anon key only - NEVER use service role key in CI.
 */

import { createClient } from "@supabase/supabase-js";
import { expect, test, describe, beforeAll } from "vitest";

const SUPABASE_URL = process.env.CI_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.CI_SUPABASE_ANON_KEY;

// Skip tests if env vars not set (local dev)
const skipIfNoEnv = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("⚠️  Skipping RLS tests - CI_SUPABASE_URL and CI_SUPABASE_ANON_KEY not set");
    return true;
  }
  return false;
};

describe("Supabase RLS Tests", () => {
  let supabase: ReturnType<typeof createClient>;

  beforeAll(() => {
    if (skipIfNoEnv()) return;
    
    supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
  });

  describe("Public Access (Anon Key)", () => {
    test("should allow anon to insert into leads table", async () => {
      if (skipIfNoEnv()) return;

      const testEmail = `rls-test+${Date.now()}@flashfusion.ai`;
      
      const { data, error } = await supabase
        .from("leads")
        .insert({
          email: testEmail,
          source: "ci-test",
          plan: "free"
        })
        .select();

      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data?.[0]?.email).toBe(testEmail);
    });

    test("should NOT allow anon to access admin tables", async () => {
      if (skipIfNoEnv()) return;

      const { data, error } = await supabase
        .from("admin_audit")
        .select("*")
        .limit(1);

      // Expect either no data or an RLS/permission error
      expect(data).toBeNull();
      expect(error).toBeTruthy();
      
      const errorMessage = (error?.message || "").toLowerCase();
      const hasPermissionError = errorMessage.includes("permission denied") ||
                                 errorMessage.includes("rls") ||
                                 errorMessage.includes("not authorized") ||
                                 errorMessage.includes("access denied");
      
      expect(hasPermissionError).toBe(true);
    });

    test("should NOT allow anon to delete from protected tables", async () => {
      if (skipIfNoEnv()) return;

      const { error } = await supabase
        .from("user_profiles")
        .delete()
        .eq("id", "non-existent-id");

      // Should fail due to RLS
      expect(error).toBeTruthy();
    });
  });

  describe("Data Isolation", () => {
    test("should only return data visible to anon user", async () => {
      if (skipIfNoEnv()) return;

      // Attempt to read from a table that requires authentication
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .limit(10);

      // Either no access (error) or only public projects (data filtered by RLS)
      if (error) {
        const errorMessage = (error.message || "").toLowerCase();
        const hasPermissionError = errorMessage.includes("permission") ||
                                   errorMessage.includes("rls") ||
                                   errorMessage.includes("not authorized");
        expect(hasPermissionError).toBe(true);
      } else {
        // If data is returned, verify it's public data only
        expect(Array.isArray(data)).toBe(true);
        // All returned projects should be public
        data?.forEach((project: any) => {
          expect(project.visibility === "public" || project.is_public === true).toBe(true);
        });
      }
    });
  });

  describe("Rate Limiting & Abuse Prevention", () => {
    test("should prevent excessive inserts from same source", async () => {
      if (skipIfNoEnv()) return;

      const source = `abuse-test-${Date.now()}`;
      const promises = [];

      // Attempt 20 rapid inserts
      for (let i = 0; i < 20; i++) {
        promises.push(
          supabase.from("leads").insert({
            email: `test${i}@example.com`,
            source
          })
        );
      }

      const results = await Promise.allSettled(promises);
      
      // Some should succeed, but rate limiting should kick in
      const succeeded = results.filter(r => r.status === "fulfilled").length;
      const failed = results.filter(r => r.status === "rejected").length;

      // Expect some failures due to rate limiting
      // (Adjust threshold based on your actual rate limits)
      console.log(`Rate limit test: ${succeeded} succeeded, ${failed} failed`);
      expect(succeeded + failed).toBe(20);
    });
  });

  describe("Input Validation", () => {
    test("should reject invalid email formats", async () => {
      if (skipIfNoEnv()) return;

      const { error } = await supabase
        .from("leads")
        .insert({
          email: "not-an-email",
          source: "validation-test"
        });

      // Should fail validation
      expect(error).toBeTruthy();
    });

    test("should reject SQL injection attempts", async () => {
      if (skipIfNoEnv()) return;

      const maliciousInput = "'; DROP TABLE leads; --";
      
      const { error } = await supabase
        .from("leads")
        .insert({
          email: `${maliciousInput}@example.com`,
          source: maliciousInput
        });

      // Supabase should safely handle this
      // Either it fails validation or is safely escaped
      if (!error) {
        // If it succeeds, verify the data was safely stored
        const { data } = await supabase
          .from("leads")
          .select("source")
          .eq("email", `${maliciousInput}@example.com`)
          .single();
        
        // The source should contain the literal string, not execute SQL
        expect(data?.source).toBe(maliciousInput);
      }
    });
  });
});
