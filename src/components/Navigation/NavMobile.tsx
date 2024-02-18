"use client";

import ButtonClose from "@/components/ButtonClose/ButtonClose";
import Logo from "@/components/Logo/Logo";
import { Menu } from "@/lib/data/menu";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import ThemeToggleButton from "../Button/ThemeToggleButton";
import SocialsList from "../SocialsList/SocialsList";

export interface NavMobileProps {
  data: Menu[];
  onClickClose?: () => void;
}

const NavMobile: React.FC<NavMobileProps> = ({ data, onClickClose }) => {
  const _renderMenuChild = (
    item: Menu,
    itemClass = " pl-3 text-neutral-900 dark:text-neutral-200 font-medium ",
  ) => {
    return (
      <ul className="nav-mobile-sub-menu pb-1 pl-6 text-base">
        {item.children?.map((i, index) => (
          <Disclosure key={index} as="li">
            <Link
              href={{
                pathname: i.href || undefined,
              }}
              className={`mt-0.5 flex rounded-lg pr-4 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 ${itemClass}`}
            >
              <span
                className={`py-2.5 ${!i.children ? "block w-full" : ""}`}
                onClick={onClickClose}
              >
                {i.title}
              </span>
              {i.children && (
                <span
                  className="flex flex-grow items-center"
                  onClick={(e) => e.preventDefault()}
                >
                  <Disclosure.Button
                    as="span"
                    className="flex flex-grow justify-end"
                  >
                    <ChevronDownIcon
                      className="ml-2 h-4 w-4 text-slate-500"
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                </span>
              )}
            </Link>
            {i.children && (
              <Disclosure.Panel>
                {_renderMenuChild(
                  i,
                  "pl-3 text-slate-600 dark:text-slate-400 ",
                )}
              </Disclosure.Panel>
            )}
          </Disclosure>
        ))}
      </ul>
    );
  };

  const _renderItem = (item: Menu, index: number) => {
    return (
      <Disclosure
        key={index}
        as="li"
        className="text-slate-900 dark:text-white"
      >
        <Link
          className="flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-medium uppercase tracking-wide hover:bg-slate-100 dark:hover:bg-slate-800"
          href={{
            pathname: item.href || undefined,
          }}
        >
          <span
            className={!item.children ? "block w-full" : ""}
            onClick={onClickClose}
          >
            {item.title}
          </span>
          {item.children && (
            <span
              className="block flex-grow"
              onClick={(e) => e.preventDefault()}
            >
              <Disclosure.Button
                as="span"
                className="flex flex-grow justify-end"
              >
                <ChevronDownIcon
                  className="ml-2 h-4 w-4 text-neutral-500"
                  aria-hidden="true"
                />
              </Disclosure.Button>
            </span>
          )}
        </Link>
        {item.children && (
          <Disclosure.Panel>{_renderMenuChild(item)}</Disclosure.Panel>
        )}
      </Disclosure>
    );
  };

  const renderMagnifyingGlassIcon = () => {
    return (
      <svg
        width={22}
        height={22}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 22L20 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const renderSearchForm = () => {
    return (
      <form
        action=""
        method="POST"
        className="flex-1 text-slate-900 dark:text-slate-200"
      >
        <div className="flex h-full items-center space-x-1 rounded-xl bg-slate-50 px-4 py-2 dark:bg-slate-800">
          {renderMagnifyingGlassIcon()}
          <input
            type="search"
            placeholder="검색어를 입력하세요..."
            className="w-full border-none bg-transparent text-sm focus:outline-none focus:ring-0 "
          />
        </div>
        <input type="submit" hidden value="" />
      </form>
    );
  };

  return (
    <div className="h-screen w-full transform divide-y-2 divide-neutral-100 overflow-y-auto bg-white py-2 shadow-lg ring-1 transition dark:divide-neutral-800 dark:bg-neutral-900 dark:ring-neutral-700">
      <div className="px-5 py-6">
        <Logo />
        <div className="mt-5 flex flex-col text-sm text-slate-600 dark:text-slate-300">
          <span>업무를 더욱 편하게</span>

          <div className="mt-4 flex items-center justify-between">
            <SocialsList itemClass="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xl" />
            <ThemeToggleButton />
          </div>
        </div>
        <span className="absolute right-2 top-2 p-1">
          <ButtonClose onClick={onClickClose} />
        </span>

        <div className="mt-5">{renderSearchForm()}</div>
      </div>
      <ul className="flex flex-col space-y-1 px-2 py-6">
        {data.map(_renderItem)}
      </ul>
    </div>
  );
};

export default NavMobile;
