import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useState } from "react";

export default function Authenticated({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {
  const user = usePage().props.auth.user;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-end">
            <div className="hidden sm:ms-6 sm:flex sm:items-center">
              <div className="relative ms-3">
                {/* Dropdown menu */}
                <Dropdown>
                  <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                      >
                        {user.name}

                        <svg
                          className="-me-0.5 ms-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  </Dropdown.Trigger>

                  <Dropdown.Content>
                    <Dropdown.Link href={route("profile.edit")}>
                      Thông tin cá nhân
                    </Dropdown.Link>
                    <Dropdown.Link
                      href={route("logout")}
                      method="post"
                      as="button"
                    >
                      Đăng xuất
                    </Dropdown.Link>
                  </Dropdown.Content>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="flex">
        <aside className="fixed inset-y-0 left-0 z-40 w-64 h-100 bg-white shadow-lg p-4">
          {/* Logo */}
          <div className="flex flex-row items-center h-10 mb-6">
            <Link href="#">
              <ApplicationLogo className="h-10 w-10 fill-current text-gray-500" />
            </Link>
            <h1 className="ml-2 text-2xl font-medium uppercase text-primary-500">
              Novotel
            </h1>
          </div>

          {/* Menu */}
          <div className="space-y-2 pt-4">
            {/* Dashboard */}
            <Link
              href={route("dashboard")}
              className={`flex items-center rounded-lg px-4 py-3 text-gray-700 ${
                route().current("dashboard")
                  ? "bg-primary-50 text-primary-600"
                  : "hover:bg-primary-50 text-primary-600"
              }`}
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="ml-3">Trang chủ</span>
            </Link>

            {/* Front desk */}
            <Link
              href="#"
              className="flex items-center rounded-lg px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0zm16 0v1.5a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5V7h2zM7 7v1.5a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5V7h2z"
                />
              </svg>
              <span className="ml-3">Lễ tân</span>
            </Link>

            {/* Guests */}
            <Link
              href="#"
              className="flex items-center rounded-lg px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="ml-3">Khách</span>
            </Link>

            {/* Rooms */}
            <Link
              href="#"
              className="flex items-center rounded-lg px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="ml-3">Phòng</span>
            </Link>

            {/* Rate */}
            <Link
              href="#"
              className="flex items-center rounded-lg px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="ml-3">Giá phòng</span>
            </Link>
          </div>
        </aside>
      </div>
      <main className="ml-64 pl-2 py-2">{children}</main>
    </div>
  );
}
