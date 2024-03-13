import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from '~/layouts';
import NotFound from '~/pages/not-found';
import Warehouse from '~/pages/warehouse';
import Product from '~/pages/product';
import ProductType from './pages/product-type';
import ProductGroup from './pages/product-group';
import ProductUnit from './pages/product-unit';
import Supplier from './pages/supplier';
import Login from './pages/login';
import WhImport from './pages/wh-transactions/imports';
import WhExport from './pages/wh-transactions/exports';
import WhTransfer from './pages/wh-transactions/transfers';
import WhInventory from './pages/wh-transactions/inventorys';
import WhMap from './pages/wh-map';
import Employee from './pages/employee';
import Role from './pages/role';
import User from './pages/user';
import Loading from './components/loading';
import WhReport from './pages/wh-report';
import WhCard from './pages/wh-card';
import Organization from './pages/organization';
import './GlobalStyles.scss';
import { StoreProvider } from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StoreProvider>
      <Loading />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdminLayout />}>
            <Route path="warehouse" element={<Warehouse />}></Route>
            <Route path="product" element={<Product />}></Route>
            <Route path="product-type" element={<ProductType />}></Route>
            <Route path="product-group" element={<ProductGroup />}></Route>
            <Route path="product-unit" element={<ProductUnit />}></Route>
            <Route path="supplier" element={<Supplier />}></Route>
            <Route path="wh-imports" element={<WhImport />}></Route>
            <Route path="wh-exports" element={<WhExport />}></Route>
            <Route path="wh-transfers" element={<WhTransfer />}></Route>
            {/* <Route path="wh-inventories" element={<WhInventory />}></Route> */}
            <Route path="/wh-map" element={<WhMap />}></Route>
            <Route path="employee" element={<Employee />}></Route>
            <Route path="role" element={<Role />}></Route>
            <Route path="account" element={<User />}></Route>
            <Route path="wh-report" element={<WhReport />}></Route>
            <Route path="wh-card" element={<WhCard />}></Route>
            <Route path="organization" element={<Organization />}></Route>
          </Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>,
);
