import React from "react";
import { MdDataset } from "react-icons/md";

const index = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 text-white ">
    <div className="w-96 flex flex-col flex-auto justify-center items-center">
      <div className="mb-5">
        <MdDataset size={70} />
      </div>
      <div className="mb-2 text-center">Welcome to Inventory</div>
      <div className="mb-4 text-center">
        Log in with your account to continue
      </div>
      <div className="flex flex-row gap-3">
        <div>
            <button onClick={() => signIn('auth0')}>Log in</button>
        </div>
        <div>
            <button onClick={() => signUp('auth0')}>Sign up</button>
        </div>
      </div>
    </div>
  </div>
);

export default index;
