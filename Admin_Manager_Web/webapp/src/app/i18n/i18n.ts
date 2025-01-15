import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import SIDER_EN from "../locales/en/sider.json";
import SIDER_VI from "../locales/vi/sider.json";
import USER_MANAGEMENT_EN from "../locales/en/user-management.json";
import USER_MANAGEMENT_VI from "../locales/vi/user-management.json";
import DASHBOARD_EN from "../locales/en/dashboard.json";
import DASHBOARD_VI from "../locales/vi/dashboard.json";
import CUSTOMERS_EN from "../locales/en/customers.json";
import CUSTOMERS_VI from "../locales/vi/customers.json";
import LEADERS_EN from "../locales/en/leaders.json";
import LEADERS_VI from "../locales/vi/leaders.json";
import WORKERS_EN from "../locales/en/workers.json";
import WORKERS_VI from "../locales/vi/workers.json";
import SERVICES_EN from "../locales/en/services.json";
import SERVICES_VI from "../locales/vi/services.json";
import PRODUCTS_EN from "../locales/en/products.json";
import PRODUCTS_VI from "../locales/vi/products.json";
import CONTRACTS_EN from "../locales/en/contracts.json";
import CONTRACTS_VI from "../locales/vi/contracts.json";
import REQUEST_EN from "../locales/en/requests.json";
import REQUEST_VI from "../locales/vi/requests.json";
import ORDERS_EN from "../locales/en/orders.json";
import ORDERS_VI from "../locales/vi/orders.json";
import RATINGS_EN from "../locales/en/ratings.json";
import RATINGS_VI from "../locales/vi/ratings.json";
import APARTMENTS_EN from "../locales/en/apartments.json";
import APARTMENTS_VI from "../locales/vi/apartments.json";
import CUSTOMER_VERIFY_EN from "../locales/en/customer-verify.json";
import CUSTOMER_VERIFY_VI from "../locales/vi/customer-verify.json";

export const locales = {
  en: "English",
  vi: "Tiếng Việt",
} as const;

export const changeLanguage = (language: string) => {
  i18n.changeLanguage(language);
};

export const resources = {
  en: {
    sider: SIDER_EN,
    userManagement: USER_MANAGEMENT_EN,
    dashboard: DASHBOARD_EN,
    customers: CUSTOMERS_EN,
    requests: REQUEST_EN,
    apartments: APARTMENTS_EN,
    workers: WORKERS_EN,
    leaders: LEADERS_EN,
    services: SERVICES_EN,
    products: PRODUCTS_EN,
    contracts: CONTRACTS_EN,
    orders: ORDERS_EN,
    ratings: RATINGS_EN,
    customerVerify: CUSTOMER_VERIFY_EN,
  },
  vi: {
    sider: SIDER_VI,
    userManagement: USER_MANAGEMENT_VI,
    dashboard: DASHBOARD_VI,
    customers: CUSTOMERS_VI,
    requests: REQUEST_VI,
    apartments: APARTMENTS_VI,
    workers: WORKERS_VI,
    leaders: LEADERS_VI,
    services: SERVICES_VI,
    products: PRODUCTS_VI,
    contracts: CONTRACTS_VI,
    orders: ORDERS_VI,
    ratings: RATINGS_VI,
    customerVerify: CUSTOMER_VERIFY_VI,
  },
} as const;

export const defaultNS = "dashboard";

i18n.use(initReactI18next).init({
  resources,
  lng: "vi",
  ns: ["dashboard"],
  defaultNS: defaultNS,
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
});
