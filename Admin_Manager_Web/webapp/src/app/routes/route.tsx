import { Suspense } from "react";
import {
  Navigate,
  Outlet,
  ScrollRestoration,
  createBrowserRouter,
} from "react-router-dom";

import { ROLE } from "../../constants/role";

import PrivateRoute from "./pRoute";
import AdminLayout from "../layout/admin-layout";
import ManagerLayout from "../layout/manager-layout";

//public
import LoginPage from "../pages/public/LoginPage";
import ChangePasswordPage from "../pages/public/ChangePasswordPage";
import ForgotPasswordPage from "../pages/public/ForgotPasswordPage";

//admin
import UserManagementPage from "../pages/admin/UserManagementPage";

//manager
import DashboardPage from "../pages/manager/DashboardPage";
import CustomerManagementPage from "../pages/manager/CustomerManagementPage";
import LeaderManagementPage from "../pages/manager/LeaderManagementPage";
import WorkerManagementPage from "../pages/manager/WorkerManagementPage";
import ServiceManagementPage from "../pages/manager/ServiceManagementPage";
import ProductManagementPage from "../pages/manager/ProductManagementPage";
import ContractManagementPage from "../pages/manager/ContractManagementPage";
import RequestManagementPage from "../pages/manager/RequestManagementPage";
import OrderManagementPage from "../pages/manager/OrderManagementPage";
import RatingManagementPage from "../pages/manager/RatingManagementPage";
import ApartmentManagementPage from "../pages/manager/ApartmentManagementPage";
import VerifyCustomerPage from "../pages/manager/VerifyCustomerPage";

//other page
import NotFoundPage from "../pages/404Page";
import TestPage from "../pages/TestPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<></>}>
        <Outlet />
        <ScrollRestoration />
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: (
          <PrivateRoute inverted={true} children={<Navigate to="/login" />} />
        ),
      },
      //admin
      {
        path: "user-management",
        element: (
          <Suspense fallback={<></>}>
            <PrivateRoute inverted={false} requiredRoles={[ROLE.admin]}>
              <AdminLayout>
                <UserManagementPage />
              </AdminLayout>
            </PrivateRoute>
          </Suspense>
        ),
      },
      //manager
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<></>}>
            <PrivateRoute inverted={false} requiredRoles={[ROLE.manager]}>
              <ManagerLayout>
                <DashboardPage />
              </ManagerLayout>
            </PrivateRoute>
          </Suspense>
        ),
      },
      {
        path: "customers",
        element: (
          <Suspense fallback={<></>}>
            <PrivateRoute inverted={false} requiredRoles={[ROLE.manager]}>
              <ManagerLayout>
                <CustomerManagementPage />
              </ManagerLayout>
            </PrivateRoute>
          </Suspense>
        ),
      },
      {
        path: "leaders",
        element: (
          <Suspense fallback={<></>}>
            <PrivateRoute inverted={false} requiredRoles={[ROLE.manager]}>
              <ManagerLayout>
                <LeaderManagementPage />
              </ManagerLayout>
            </PrivateRoute>
          </Suspense>
        ),
      },
      {
        path: "workers",
        element: (
          <Suspense fallback={<></>}>
            <PrivateRoute inverted={false} requiredRoles={[ROLE.manager]}>
              <ManagerLayout>
                <WorkerManagementPage />
              </ManagerLayout>
            </PrivateRoute>
          </Suspense>
        ),
      },
      {
        path: "services",
        element: (
          <Suspense fallback={<></>}>
            <PrivateRoute inverted={false} requiredRoles={[ROLE.manager]}>
              <ManagerLayout>
                <ServiceManagementPage />
              </ManagerLayout>
            </PrivateRoute>
          </Suspense>
        ),
      },
      {
        path: "products",
        element: (
          <Suspense fallback={<></>}>
            <PrivateRoute inverted={false} requiredRoles={[ROLE.manager]}>
              <ManagerLayout>
                <ProductManagementPage />
              </ManagerLayout>
            </PrivateRoute>
          </Suspense>
        ),
      },
      {
        path: "contracts",
        element: (
          <Suspense fallback={<></>}>
            <PrivateRoute inverted={false} requiredRoles={[ROLE.manager]}>
              <ManagerLayout>
                <ContractManagementPage />
              </ManagerLayout>
            </PrivateRoute>
          </Suspense>
        ),
      },
      {
        path: "requests",
        element: (
          <Suspense fallback={<></>}>
            <PrivateRoute inverted={false} requiredRoles={[ROLE.manager]}>
              <ManagerLayout>
                <RequestManagementPage />
              </ManagerLayout>
            </PrivateRoute>
          </Suspense>
        ),
      },
      // {
      //   path: "requests/:requestId",
      //   element: (
      //     <Suspense fallback={<></>}>
      //       <PrivateRoute inverted={false} requiredRoles={[ROLE.manager]}>
      //         <ManagerLayout>
      //           <RequestDetailsPage />
      //         </ManagerLayout>
      //       </PrivateRoute>
      //     </Suspense>
      //   ),
      // },
      {
        path: "orders",
        element: (
          <Suspense fallback={<></>}>
            <PrivateRoute inverted={false} requiredRoles={[ROLE.manager]}>
              <ManagerLayout>
                <OrderManagementPage />
              </ManagerLayout>
            </PrivateRoute>
          </Suspense>
        ),
      },
      {
        path: "ratings",
        element: (
          <Suspense fallback={<></>}>
            <PrivateRoute inverted={false} requiredRoles={[ROLE.manager]}>
              <ManagerLayout>
                <RatingManagementPage />
              </ManagerLayout>
            </PrivateRoute>
          </Suspense>
        ),
      },
      {
        path: "apartments",
        element: (
          <Suspense fallback={<></>}>
            <PrivateRoute inverted={false} requiredRoles={[ROLE.manager]}>
              <ManagerLayout>
                <ApartmentManagementPage />
              </ManagerLayout>
            </PrivateRoute>
          </Suspense>
        ),
      },
      {
        path: "customer-verify",
        element: (
          <Suspense fallback={<></>}>
            <PrivateRoute inverted={false} requiredRoles={[ROLE.manager]}>
              <ManagerLayout>
                <VerifyCustomerPage />
              </ManagerLayout>
            </PrivateRoute>
          </Suspense>
        ),
      },
      //rest
      {
        path: "test",
        element: (
          <Suspense fallback={<></>}>
            <TestPage />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<></>}>
            <PrivateRoute inverted={false}>
              <NotFoundPage />
            </PrivateRoute>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<></>}>
        <PrivateRoute inverted={true}>
          <LoginPage />
        </PrivateRoute>
      </Suspense>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <Suspense fallback={<></>}>
        <PrivateRoute inverted={true}>
          <ForgotPasswordPage />
        </PrivateRoute>
      </Suspense>
    ),
  },
  {
    path: "/change-password",
    element: (
      <Suspense fallback={<></>}>
        <ChangePasswordPage />
      </Suspense>
    ),
  },
]);
