import { MENU } from '../../../constants/menu.ts';
import { Link, useLocation } from 'react-router-dom';

const Nav = () => {
  const { pathname, hash } = useLocation();

  const isChildrenActive = (path: string) => {
    return path.split('/').at(1) === pathname.split('/').at(1);
  };

  return (
    <ul className='flex justify-between w-full sm:basis-3/5 md:basis-2/5'>
      {MENU.map(({ path, label, children }) => (
        <li
          key={path}
          className={`relative group ${isChildrenActive(path) || pathname === path ? 'text-secondary-300' : 'text-white'} text-lg font-semibold`}
        >
          <Link to={path}>{label}</Link>
          {children && (
            <ul className='absolute top-full left-1/2 transform -translate-x-1/2 p-4 flex flex-col gap-y-3 rounded-2xl bg-primary-700 pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-150'>
              {children.map(({ path, label }) => (
                <li
                  key={path}
                  className={`text-center w-24 ${pathname + hash === path ? 'text-secondary-300' : 'text-white'} font-semibold`}
                >
                  <Link to={path}>{label}</Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Nav;
