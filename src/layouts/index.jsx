import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import classNames from 'classnames/bind';
import Style from './Adminlayout.module.scss';
import { AiFillSetting } from 'react-icons/ai';
import { AiFillShop } from 'react-icons/ai';
import { TbLogout } from 'react-icons/tb';
import { MdWarehouse } from 'react-icons/md';
import { FaBoxArchive } from 'react-icons/fa6';
import { TbBoxMultiple } from 'react-icons/tb';
import { SlSizeActual, SlSizeFullscreen, SlShuffle } from 'react-icons/sl';
import { RiMap2Fill } from 'react-icons/ri';
import { BiCategory } from 'react-icons/bi';
import { BsBox2 } from 'react-icons/bs';
import { TbTruckDelivery } from 'react-icons/tb';
import { MdPeopleOutline } from 'react-icons/md';
import { LuServerCog } from 'react-icons/lu';
import { RiLockPasswordLine } from 'react-icons/ri';
import { PiCertificate } from 'react-icons/pi';
import { TbReportAnalytics } from 'react-icons/tb';
import { BsCardText } from 'react-icons/bs';
import { FaListCheck } from 'react-icons/fa6';
import { GoOrganization } from 'react-icons/go';
import withAuth from '~/withAuth';
import SidebarMenu from './sidebar/SidebarMenu';
import localStorageUtils from '~/utils/localStorageUtils';
import { useNavigate } from 'react-router-dom';
import { hasAuthorities } from '~/utils/common';
import { KEY_AUTHORITIES } from '~/utils/appConstant';
import logo from '~/assets/images/ChungLan.jpg';

const cx = classNames.bind(Style);

// {
//   icon: FaListCheck,
//   title: 'Kiểm kê',
//   to: '/wh-inventories',
// },

function AdminLayout() {
  const [toggleExpand, setToggleExpand] = useState(false);
  const history = useNavigate();

  const handleResetSize = () => {
    setToggleExpand(!toggleExpand);
  };

  const handleLogout = () => {
    localStorageUtils.clearSession();
    history('/login');
  };

  const menus = [
    {
      icon: MdWarehouse,
      title: 'Quản lý kho',
      sub: [
        {
          icon: TbBoxMultiple,
          title: 'Danh sách kho',
          isShow: hasAuthorities([]),
          to: '/warehouse',
        },
        {
          icon: RiMap2Fill,
          title: 'Sơ đồ kho',
          isShow: hasAuthorities([KEY_AUTHORITIES.WAREHOUSE.WH_MAP]),
          to: '/wh-map',
        },
        {
          icon: SlSizeActual,
          title: 'Nhập kho',
          isShow: hasAuthorities([
            KEY_AUTHORITIES.WH_IMPORT.SEARCH_MY_CREATE,
            KEY_AUTHORITIES.WH_IMPORT.SEARCH_WAREHOUSE,
          ]),
          to: '/wh-imports',
        },
        {
          icon: SlSizeFullscreen,
          title: 'Xuất kho',
          isShow: hasAuthorities([
            KEY_AUTHORITIES.WH_EXPORT.SEARCH_MY_CREATE,
            KEY_AUTHORITIES.WH_EXPORT.SEARCH_WAREHOUSE,
          ]),
          to: '/wh-exports',
        },
        {
          icon: SlShuffle,
          title: 'Điều chuyển',
          isShow: hasAuthorities([
            KEY_AUTHORITIES.WH_TRANSFER.SEARCH_MY_CREATE,
            KEY_AUTHORITIES.WH_TRANSFER.SEARCH_WAREHOUSE,
          ]),
          to: '/wh-transfers',
        },
      ],
    },
    {
      icon: TbReportAnalytics,
      title: 'Báo cáo thống kê',
      sub: [
        {
          icon: BsCardText,
          title: 'Báo cáo nhập xuất tồn',
          isShow: hasAuthorities([KEY_AUTHORITIES.WAREHOUSE.WH_REPORT]),
          to: '/wh-report',
        },
        {
          icon: BsCardText,
          title: 'Thẻ kho',
          isShow: hasAuthorities([KEY_AUTHORITIES.WAREHOUSE.WH_CARD]),
          to: '/wh-card',
        },
      ],
    },
    {
      icon: FaBoxArchive,
      title: 'Danh mục hàng hóa',
      sub: [
        {
          icon: BsBox2,
          title: 'Hàng hóa',
          isShow: hasAuthorities([]),
          to: '/product',
        },
        {
          icon: BiCategory,
          title: 'Loại hàng hóa',
          isShow: hasAuthorities([]),
          to: '/product-type',
        },
        {
          icon: BiCategory,
          title: 'Nhóm hàng hóa',
          isShow: hasAuthorities([]),
          to: '/product-group',
        },
        {
          icon: BiCategory,
          title: 'Đơn vị tính',
          isShow: hasAuthorities([]),
          to: '/product-unit',
        },
        {
          icon: TbTruckDelivery,
          title: 'Nhà cung cấp',
          isShow: hasAuthorities([]),
          to: '/supplier',
        },
      ],
    },
    {
      icon: LuServerCog,
      title: 'Quản lý nhân viên',
      sub: [
        {
          icon: MdPeopleOutline,
          title: 'Nhân viên',
          isShow: hasAuthorities([]),
          to: '/employee',
        },
        {
          icon: RiLockPasswordLine,
          title: 'Tài khoản',
          isShow: hasAuthorities([]),
          to: '/account',
        },
        {
          icon: PiCertificate,
          title: 'Vai trò',
          isShow: hasAuthorities([]),
          to: '/role',
        },
      ],
    },
    {
      icon: GoOrganization,
      title: 'Thông tin doanh nghiệp',
      isShow: hasAuthorities([]),
      to: '/organization',
    },
  ];

  return (
    <>
      <div className={cx('container')}>
        <div className={cx('sidebar', { active: toggleExpand })}>
          <div className={cx('logo-details')}>
            <AiFillShop className={cx('icon')} onClick={handleResetSize} />
            {/* <div className={cx('icon')} onClick={handleResetSize}>
              <img src={logo} />
            </div> */}
            <span className={cx('logo-name', { active: !toggleExpand })}>Chung Lan</span>
          </div>
          <div className={cx('menu')}>
            <SidebarMenu menuData={menus} toggleExpand={toggleExpand} />
          </div>
          <div className={cx('logout', { active: toggleExpand })}>
            <TbLogout className={cx('icon-logout')} title="Đăng xuất" onClick={handleLogout} />
          </div>
        </div>
        <div className={cx('section', { 'reset-size': toggleExpand })}>
          <div className={cx('item')}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(AdminLayout);
