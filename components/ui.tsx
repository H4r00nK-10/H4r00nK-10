import { cn } from '@/lib/utils';
export function Card({className,...p}:React.HTMLAttributes<HTMLDivElement>){return <div className={cn('glass rounded-3xl p-6',className)} {...p}/>}
export function Button({className,...p}:React.ButtonHTMLAttributes<HTMLButtonElement>){return <button className={cn('rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] dark:bg-white dark:text-slate-950',className)} {...p}/>}
export function Badge({children,className}:{children:React.ReactNode;className?:string}){return <span className={cn('rounded-full px-3 py-1 text-xs font-bold',className)}>{children}</span>}
