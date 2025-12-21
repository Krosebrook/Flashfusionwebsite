(()=>{var e={};e.id=935,e.ids=[935],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},9121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3873:e=>{"use strict";e.exports=require("path")},7113:(e,t,a)=>{"use strict";a.r(t),a.d(t,{GlobalError:()=>o.a,__next_app__:()=>f,pages:()=>c,routeModule:()=>p,tree:()=>d});var s=a(260),r=a(8203),i=a(5155),o=a.n(i),n=a(7292),l={};for(let e in n)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>n[e]);a.d(t,l);let d=["",{children:["demo",{children:["ai-creation",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,2043)),"/home/runner/work/Flashfusionwebsite/Flashfusionwebsite/src/apps/site/app/demo/ai-creation/page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(a.bind(a,9611)),"/home/runner/work/Flashfusionwebsite/Flashfusionwebsite/src/apps/site/app/layout.tsx"],error:[()=>Promise.resolve().then(a.bind(a,2627)),"/home/runner/work/Flashfusionwebsite/Flashfusionwebsite/src/apps/site/app/error.tsx"],loading:[()=>Promise.resolve().then(a.bind(a,4717)),"/home/runner/work/Flashfusionwebsite/Flashfusionwebsite/src/apps/site/app/loading.tsx"],"not-found":[()=>Promise.resolve().then(a.bind(a,1129)),"/home/runner/work/Flashfusionwebsite/Flashfusionwebsite/src/apps/site/app/not-found.tsx"]}],c=["/home/runner/work/Flashfusionwebsite/Flashfusionwebsite/src/apps/site/app/demo/ai-creation/page.tsx"],f={require:a,loadChunk:()=>Promise.resolve()},p=new s.AppPageRouteModule({definition:{kind:r.RouteKind.APP_PAGE,page:"/demo/ai-creation/page",pathname:"/demo/ai-creation",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},5873:(e,t,a)=>{Promise.resolve().then(a.bind(a,2043))},2321:(e,t,a)=>{Promise.resolve().then(a.bind(a,4011))},4011:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>m});var s=a(5512),r=a(8009),i=a(6008),o=a(4098),n=a(4339),l=a(1680);let d=(0,l.A)("pause",[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]]),c=(0,l.A)("rotate-ccw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);var f=a(4849);let p=(0,l.A)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]),u=[{id:1,title:"Project Description",description:"Analyzing your project requirements and generating architecture plan...",code:`// Project: Task Management App
// Tech Stack: React + TypeScript + Tailwind
// Backend: Supabase
// Features: Authentication, CRUD operations, Real-time updates

const projectSpec = {
  name: "TaskMaster Pro",
  type: "Full-Stack Web App",
  framework: "React 18 + TypeScript",
  styling: "Tailwind CSS",
  backend: "Supabase",
  features: [
    "User authentication",
    "Task CRUD operations",
    "Real-time collaboration",
    "Priority management",
    "Due date tracking"
  ]
};`,duration:3e3},{id:2,title:"AI Analysis",description:"AI is analyzing project requirements and selecting optimal architecture...",code:`// AI Architecture Analysis Results
const architectureDecision = {
  frontend: {
    framework: "React 18",
    stateManagement: "Zustand",
    routing: "React Router v6",
    uiLibrary: "shadcn/ui + Tailwind",
    forms: "React Hook Form + Zod"
  },
  backend: {
    database: "Supabase PostgreSQL",
    auth: "Supabase Auth",
    realtime: "Supabase Realtime",
    storage: "Supabase Storage"
  },
  deployment: {
    frontend: "Vercel",
    backend: "Supabase Cloud",
    ci_cd: "GitHub Actions"
  }
};

console.log("✅ Architecture validated by AI");`,duration:3e3},{id:3,title:"Code Generation",description:"Generating production-ready code with best practices and type safety...",code:`// Generated React Component
import { useState } from 'react';
import { supabase } from './lib/supabase';
import { Task } from './types';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Task list implementation */}
    </div>
  );
}`,duration:4e3},{id:4,title:"UI/UX Design",description:"Applying modern design system with accessibility and responsive layout...",code:`// Tailwind CSS Configuration
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#EC4899'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out'
      }
    }
  }
};

// Component with Tailwind classes
<div className="max-w-7xl mx-auto px-6 py-12">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Task cards with hover effects */}
  </div>
</div>`,duration:3e3},{id:5,title:"Preview Ready",description:"Your full-stack application is ready! Review, customize, or deploy now.",code:`// 🎉 Application Generated Successfully!

✅ React components: 12 files
✅ TypeScript types: 5 files
✅ Supabase schema: Created
✅ API endpoints: 8 routes
✅ Authentication: Configured
✅ Tests: 24 unit tests
✅ Documentation: README.md

// Ready to deploy
const deploymentOptions = [
  'Vercel (Recommended)',
  'Netlify',
  'AWS Amplify',
  'Railway',
  'Render'
];

// Next steps:
// 1. Review generated code
// 2. Customize as needed
// 3. Deploy with one click
// 4. Share with your team!`,duration:2e3}];function m(){let[e,t]=(0,r.useState)(0),[a,l]=(0,r.useState)(0),[m,h]=(0,r.useState)(!1),[y,x]=(0,r.useState)(!1),[g,v]=(0,r.useState)([]),b=e=>{m||(t(e),l(0),v(Array.from({length:e},(e,t)=>t)))};return(0,s.jsxs)("div",{className:"min-h-screen bg-background",children:[(0,s.jsx)("div",{className:"border-b py-4 px-6",style:{background:"var(--ff-surface)",borderColor:"rgba(255, 255, 255, 0.1)"},children:(0,s.jsxs)("div",{className:"max-w-7xl mx-auto flex items-center justify-between",children:[(0,s.jsx)(o.default,{href:"/demo",label:"Back to Workflows"}),(0,s.jsxs)("div",{className:"flex items-center gap-4",children:[!m&&0===g.length&&(0,s.jsxs)("button",{onClick:()=>{h(!0),x(!1)},className:"inline-flex items-center gap-2 px-6 py-2 rounded-lg transition-all hover:scale-105",style:{background:"var(--ff-gradient-primary)",color:"white",fontFamily:"var(--ff-font-primary)",fontWeight:"var(--ff-weight-semibold)"},children:[(0,s.jsx)(n.A,{className:"h-4 w-4"}),"Start Demo"]}),m&&(0,s.jsxs)("button",{onClick:()=>{x(!y)},className:"inline-flex items-center gap-2 px-6 py-2 rounded-lg border-2 transition-all hover:scale-105",style:{borderColor:"var(--ff-primary)",color:"var(--ff-primary)",fontFamily:"var(--ff-font-primary)",fontWeight:"var(--ff-weight-semibold)"},children:[y?(0,s.jsx)(n.A,{className:"h-4 w-4"}):(0,s.jsx)(d,{className:"h-4 w-4"}),y?"Resume":"Pause"]}),(g.length>0||m)&&(0,s.jsxs)("button",{onClick:()=>{h(!1),x(!1),t(0),l(0),v([])},className:"inline-flex items-center gap-2 px-6 py-2 rounded-lg border-2 transition-all hover:scale-105",style:{borderColor:"rgba(255, 255, 255, 0.2)",color:"var(--ff-text-secondary)",fontFamily:"var(--ff-font-primary)",fontWeight:"var(--ff-weight-semibold)"},children:[(0,s.jsx)(c,{className:"h-4 w-4"}),"Reset"]}),(0,s.jsx)(i.default,{href:"/signup",className:"inline-flex items-center gap-2 px-6 py-2 rounded-lg transition-all hover:scale-105",style:{background:"var(--ff-secondary)",color:"white",fontFamily:"var(--ff-font-primary)",fontWeight:"var(--ff-weight-semibold)"},children:"Sign Up to Build Real Apps"})]})]})}),(0,s.jsx)("div",{className:"max-w-7xl mx-auto px-6 py-8",children:(0,s.jsxs)("div",{className:"grid grid-cols-12 gap-8",children:[(0,s.jsxs)("div",{className:"col-span-12 lg:col-span-3",children:[(0,s.jsx)("h2",{className:"mb-4",style:{fontFamily:"var(--ff-font-primary)",fontSize:"var(--ff-text-lg)",fontWeight:"var(--ff-weight-semibold)",color:"var(--ff-text-primary)"},children:"Generation Steps"}),(0,s.jsx)("div",{className:"space-y-2",children:u.map((t,a)=>(0,s.jsx)("button",{onClick:()=>b(a),disabled:m,className:"w-full text-left p-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",style:{background:e===a?"rgba(255, 123, 0, 0.1)":g.includes(a)?"rgba(16, 185, 129, 0.1)":"var(--ff-surface)",border:e===a?"2px solid var(--ff-primary)":"1px solid rgba(255, 255, 255, 0.1)"},children:(0,s.jsxs)("div",{className:"flex items-center gap-3",children:[(0,s.jsx)("div",{className:"w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",style:{background:g.includes(a)?"var(--ff-success)":e===a?"var(--ff-primary)":"rgba(255, 255, 255, 0.1)",color:"white"},children:g.includes(a)?(0,s.jsx)(f.A,{className:"h-4 w-4"}):e===a&&m&&!y?(0,s.jsx)(p,{className:"h-4 w-4 animate-spin"}):(0,s.jsx)("span",{style:{fontFamily:"var(--ff-font-primary)",fontSize:"var(--ff-text-sm)"},children:t.id})}),(0,s.jsx)("span",{style:{fontFamily:"var(--ff-font-primary)",fontSize:"var(--ff-text-sm)",fontWeight:"var(--ff-weight-semibold)",color:e===a?"var(--ff-primary)":g.includes(a)?"var(--ff-success)":"var(--ff-text-secondary)"},children:t.title})]})},t.id))})]}),(0,s.jsx)("div",{className:"col-span-12 lg:col-span-9",children:(0,s.jsxs)("div",{className:"p-6 rounded-xl border",style:{background:"var(--ff-surface)",borderColor:"rgba(255, 255, 255, 0.1)"},children:[(0,s.jsxs)("div",{className:"mb-6",children:[(0,s.jsxs)("div",{className:"flex items-center justify-between mb-2",children:[(0,s.jsx)("h3",{style:{fontFamily:"var(--ff-font-primary)",fontSize:"var(--ff-text-2xl)",fontWeight:"var(--ff-weight-bold)",color:"var(--ff-text-primary)"},children:u[e].title}),(0,s.jsxs)("span",{style:{fontFamily:"var(--ff-font-primary)",fontSize:"var(--ff-text-sm)",color:"var(--ff-primary)",fontWeight:"var(--ff-weight-semibold)"},children:[Math.round(a),"%"]})]}),(0,s.jsx)("div",{className:"h-2 rounded-full overflow-hidden",style:{background:"rgba(255, 255, 255, 0.1)"},children:(0,s.jsx)("div",{className:"h-full transition-all duration-300",style:{width:`${a}%`,background:"linear-gradient(90deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)"}})}),(0,s.jsx)("p",{className:"mt-2",style:{color:"var(--ff-text-muted)",fontFamily:"var(--ff-font-secondary)",fontSize:"var(--ff-text-sm)"},children:u[e].description})]}),(0,s.jsx)("div",{className:"p-6 rounded-lg overflow-x-auto",style:{background:"var(--ff-bg-dark)",border:"1px solid rgba(255, 255, 255, 0.05)"},children:(0,s.jsx)("pre",{style:{fontFamily:"JetBrains Mono, monospace",fontSize:"var(--ff-text-sm)",color:"var(--ff-text-secondary)",lineHeight:"1.7"},children:u[e].code})}),e===u.length-1&&g.includes(e)&&(0,s.jsx)("div",{className:"mt-6 p-6 rounded-lg",style:{background:"rgba(16, 185, 129, 0.1)",border:"1px solid rgba(16, 185, 129, 0.3)"},children:(0,s.jsxs)("div",{className:"flex items-start gap-4",children:[(0,s.jsx)("div",{className:"w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",style:{background:"var(--ff-success)"},children:(0,s.jsx)(f.A,{className:"h-5 w-5 text-white"})}),(0,s.jsxs)("div",{className:"flex-1",children:[(0,s.jsx)("h4",{className:"mb-2",style:{fontFamily:"var(--ff-font-primary)",fontSize:"var(--ff-text-lg)",fontWeight:"var(--ff-weight-semibold)",color:"var(--ff-success)"},children:"Application Generated Successfully!"}),(0,s.jsx)("p",{style:{color:"var(--ff-text-secondary)",fontFamily:"var(--ff-font-secondary)",fontSize:"var(--ff-text-sm)",lineHeight:"var(--ff-leading-relaxed)"},children:"Your full-stack application is ready to deploy. Sign up now to download the code, customize it, and deploy to your preferred platform!"})]})]})})]})})]})})]})}},4098:(e,t,a)=>{"use strict";a.d(t,{default:()=>o});var s=a(5512),r=a(8686),i=a(5668);function o({href:e,label:t="Back",className:a=""}){let o=(0,r.useRouter)();return(0,s.jsxs)("button",{onClick:()=>{e?o.push(e):o.back()},className:`inline-flex items-center gap-2 transition-all hover:gap-3 ff-focus-ring ${a}`,style:{color:"var(--ff-text-secondary)",fontFamily:"var(--ff-font-secondary)",fontSize:"var(--ff-text-sm)",padding:"0.5rem 0"},"aria-label":t,children:[(0,s.jsx)(i.A,{className:"h-4 w-4"}),t]})}},4849:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});let s=(0,a(1680).A)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]])},4339:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});let s=(0,a(1680).A)("play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]])},2043:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>s});let s=(0,a(6760).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/home/runner/work/Flashfusionwebsite/Flashfusionwebsite/src/apps/site/app/demo/ai-creation/page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/home/runner/work/Flashfusionwebsite/Flashfusionwebsite/src/apps/site/app/demo/ai-creation/page.tsx","default")}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),s=t.X(0,[98,936,379],()=>a(7113));module.exports=s})();