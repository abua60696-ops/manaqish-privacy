import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/menu', label: 'القائمة', icon: '🍽️' },
  { to: '/gift', label: 'سفرة لأهلي', icon: '✈️' },
  { to: '/contests', label: 'المسابقات', icon: '🎁' },
  { to: '/loyalty', label: 'بطاقة النقاط', icon: '⭐' },
]

export default function TopTabBar() {
  return (
    <nav className="bg-sand-50/95 dark:bg-neutral-900/95 backdrop-blur border-b border-black/5 dark:border-white/10">
      <div className="flex overflow-x-auto no-scrollbar px-2">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex-1 min-w-[84px] text-center py-3 px-2 text-[13px] font-bold border-b-[3px] transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-brick-500 text-brick-600 dark:text-ember-400'
                  : 'border-transparent text-neutral-500 dark:text-neutral-400'
              }`
            }
          >
            <span className="block text-base mb-0.5">{tab.icon}</span>
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
