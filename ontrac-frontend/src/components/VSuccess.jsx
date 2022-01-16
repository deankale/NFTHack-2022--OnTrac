import React from "react";

// this is a copy-paste from the other Success page, as these should essentially be the same

export default function VSuccess () {
    return (
<div class="bg-white rounded-lg shadow sm:max-w-4xl sm:w-full sm:mx-auto sm:overflow-hidden">
    <div class="px-4 py-8 sm:px-10">
        <div class="relative mt-6">
            <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300">
                </div>
            </div>
            <div class="relative flex justify-center text-3xl leading-5">
                <span class="px-2 text-gray-500 bg-white">
                    Success!
                </span>
            </div>
        </div>
        <div class="mt-6">
            <div class="flex space-x-12">
                <span class="block w-1/2 rounded-md shadow-sm">
                    <button type="button" class="py-2 px-4  bg-green-600 hover:bg-green-500 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                        Dashboard
                    </button>
                </span>
            </div>
        </div>
    </div>
</div>
    );
}
