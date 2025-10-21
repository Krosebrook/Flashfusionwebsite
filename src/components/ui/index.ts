/**
 * @fileoverview UI Components - Barrel Export
 * @chunk ui
 * @category components
 * 
 * Centralized export for all FlashFusion UI components following the design system.
 * These components provide consistent styling, behavior, and accessibility features.
 */

// Form Controls
export { Button, type ButtonProps } from './button';
export { Input, type InputProps } from './input';
export { Textarea, type TextareaProps } from './textarea';
export { Label } from './label';
export { Checkbox } from './checkbox';
export { RadioGroup, RadioGroupItem } from './radio-group';
export { Switch } from './switch';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
export { Slider } from './slider';

// Layout & Containers
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, type CardProps } from './card';
export { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './sheet';
export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
export { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from './drawer';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';
export { Resizable, ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable';

// Data Display
export { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './table';
export { Badge, type BadgeProps } from './badge';
export { Avatar, AvatarFallback, AvatarImage } from './avatar';
export { Progress } from './progress';
export { Skeleton } from './skeleton';
export { AspectRatio } from './aspect-ratio';
export { Separator } from './separator';

// Charts & Data Visualization
export { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig 
} from './chart';

// Feedback & Status
export { Alert, AlertDescription, AlertTitle } from './alert';
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './alert-dialog';
export { Sonner, toast } from './sonner';

// Navigation
export { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from './navigation-menu';
export { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './breadcrumb';
export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './pagination';
export { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from './menubar';
export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu';
export { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from './context-menu';

// Interactive Elements
export { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from './command';
export { Popover, PopoverContent, PopoverTrigger } from './popover';
export { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
export { Toggle, type ToggleProps } from './toggle';
export { ToggleGroup, ToggleGroupItem } from './toggle-group';

// Specialized Components
export { Calendar } from './calendar';
export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './carousel';
export { ScrollArea, ScrollBar } from './scroll-area';
export { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger } from './sidebar';

// Forms & Validation
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';
export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './input-otp';

// FlashFusion Specific Components
export { FlashFusionLoader, type FlashFusionLoaderProps } from './flash-fusion-loader';
export { EmergencyMode } from './emergency-mode';
export { LiteModeIndicator } from './lite-mode-indicator';
export { SimpleErrorBoundary } from './simple-error-boundary';

// Loading & Status
export { LoadingStates } from './loading-states';
export { MemoryMonitor } from './memory-monitor';
export { FeatureStatusBadge } from './feature-status-badge';
export { DemoModeIndicator } from './demo-mode-indicator';
export { SystemStatusDashboard } from './system-status-dashboard';

// Development & Testing
export { ConfigDebug } from './config-debug';
export { PlatformVerification } from './platform-verification';
export { WorkflowTest } from './workflow-test';

// Downloads & Exports
export { UniversalDownloadManager } from './universal-download-manager';
export { MultiFormatDownloadSelector } from './multi-format-download-selector';

// AI & Recommendations
export { SmartRecommendations } from './smart-recommendations';
export { NextStepsRoadmap } from './next-steps-roadmap';

// Utilities & Hooks
export { useMobile } from './use-mobile';

/**
 * Component categories for easy navigation:
 * 
 * @category Forms
 * Button, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider, Form components
 * 
 * @category Layout
 * Card, Sheet, Dialog, Drawer, Tabs, Accordion, Collapsible, Resizable
 * 
 * @category Display
 * Table, Badge, Avatar, Progress, Skeleton, AspectRatio, Separator, Charts
 * 
 * @category Feedback
 * Alert, AlertDialog, Sonner (toast), Loading states, Status indicators
 * 
 * @category Navigation
 * NavigationMenu, Breadcrumb, Pagination, Menubar, DropdownMenu, ContextMenu
 * 
 * @category Interactive
 * Command, Popover, HoverCard, Tooltip, Toggle, ToggleGroup
 * 
 * @category Specialized
 * Calendar, Carousel, ScrollArea, Sidebar, InputOTP
 * 
 * @category FlashFusion
 * FlashFusionLoader, EmergencyMode, LiteModeIndicator, SystemStatus
 * 
 * @category Development
 * ConfigDebug, PlatformVerification, WorkflowTest, ErrorBoundary
 */

/**
 * Design System Classes:
 * 
 * @category Buttons
 * .ff-btn-primary, .ff-btn-secondary, .ff-btn-accent, .ff-btn-outline, .ff-btn-ghost
 * 
 * @category Cards
 * .ff-card, .ff-card-interactive, .ff-card-header, .ff-card-content, .ff-card-footer
 * 
 * @category Typography
 * .ff-text-display, .ff-text-headline, .ff-text-title, .ff-text-body, .ff-text-caption
 * 
 * @category Animations
 * .ff-fade-in-up, .ff-scale-pop, .ff-hover-glow, .ff-hover-scale, .ff-hover-lift
 * 
 * @category Status
 * .ff-badge-primary, .ff-badge-secondary, .ff-badge-success, .ff-badge-warning, .ff-badge-error
 */