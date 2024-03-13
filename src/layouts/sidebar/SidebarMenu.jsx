import { useState } from 'react';
import classNames from 'classnames/bind';
import Style from './sidebarMenu.module.scss';
import { FaAngleRight } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';

const cx = classNames.bind(Style);

function SidebarMenu({ menuData, toggleExpand = false }) {
  const [openSubMenus, setOpenSubMenus] = useState({});

  const handleMenuClick = (key) => {
    setOpenSubMenus((prevOpenSubMenus) => {
      const newOpenSubMenus = { ...prevOpenSubMenus };
      newOpenSubMenus[key] = newOpenSubMenus[key] ? !newOpenSubMenus[key] : true;
      return newOpenSubMenus;
    });
  };

  const renderMenus = (menus, parentKey) => {
    return menus.map((menuItem, index) => {
      const Icon = menuItem.icon;
      if (menuItem.sub) {
        const currentkey = `${parentKey}-${index}`;
        const open = openSubMenus[currentkey];
        let isShow = false;
        for (var item of menuItem.sub) {
          if (item?.isShow) {
            isShow = true;
          }
        }
        if (isShow) {
          return (
            <li key={index}>
              <div onClick={() => handleMenuClick(currentkey)} className={cx('sub-menu')}>
                <Icon className={cx('icon')} />
                <span className={cx('link-name', { active: !toggleExpand })}>{menuItem.title}</span>
                <FaAngleRight className={cx('icon-dropdown', { rotate: open })} />
              </div>
              {open && <ul className={cx('item-sub-menu')}>{renderMenus(menuItem.sub, currentkey)}</ul>}
            </li>
          );
        }
        return <></>;
      }

      if (menuItem?.isShow) {
        return (
          <li>
            <NavLink to={menuItem.to} className={(nav) => cx('nav-link', { active: nav.isActive })}>
              <Icon className={cx('icon')} />
              <span className={cx('link-name', { active: !toggleExpand })}>{menuItem.title}</span>
            </NavLink>
          </li>
        );
      }

      return <></>;
    });
  };
  return (
    <>
      <ul className={cx('nav-links')}>{renderMenus(menuData, null)}</ul>
    </>
  );
}

export default SidebarMenu;
