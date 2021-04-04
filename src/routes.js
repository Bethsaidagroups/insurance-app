import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import StaffView from 'src/views/Staff'
import CreateStaffView from 'src/views/Staff/CreateStaff'
import AgentView from 'src/views/Agent'
import CustomerView from 'src/views/Customer'
import EditCustomerView from 'src/views/Customer/EditCustomer'
import RegisterCustomerView from 'src/views/Customer/RegisterCustomer'
import PolicyView from "src/views/Policy"
import AddPolicyView from "src/views/Policy/AddPolicy"
import EditPolicyView from "src/views/Policy/EditPolicy"
import PaymentView from "src/views/Payment"


const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'staffs', element: <StaffView /> },
      { path: 'create-staff', element: <CreateStaffView /> },
      { path: 'agents', element: <AgentView /> },
      { path: 'customers', element: <CustomerView /> },
      { path: 'register-customer', element: <RegisterCustomerView /> },
      { path: 'edit-customer/:id', element: <EditCustomerView /> },
      { path: 'policies', element: <PolicyView /> },
      { path: 'edit-policy/:id', element: <EditPolicyView /> },
      { path: 'add-policy', element: <AddPolicyView /> },
      { path: 'payments', element: <PaymentView /> },
      { path: '*', element: <Navigate replace={false} to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/login" /> },
      { path: '*', element: <Navigate replace={false} to="/404" /> }
    ]
  }
];

export default routes;
