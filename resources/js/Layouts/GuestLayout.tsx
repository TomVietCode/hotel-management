import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
      <div className="flex flex-row items-center">
        <Link href="#">
          <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
        </Link>
          <h1 className="ml-2 text-2xl font-semibold uppercase text-primary-500">Novotel</h1>
      </div>

      <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
        {children}
      </div>
    </div>
  );
}
