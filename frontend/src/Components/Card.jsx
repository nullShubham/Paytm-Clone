import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios';
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { userNameSelectorFamily, requestedIdsAtom } from '../Recoil/UserName';
// import 'moment-timezone';
const Card = ({ searchInput, myId, historyDetails }) => {
    const localDate = moment.utc(historyDetails.createdAt).local().format('h:m A')
    const id = historyDetails.transactionId == myId ? historyDetails.toUserId : historyDetails.fromUserId;
    const userNameLoadable = useRecoilValueLoadable(userNameSelectorFamily(id));

    if (userNameLoadable.state === "loading") {
        return (
            <div className="bg-white overflow-hidden select-none ">
                <div className="flex w-full gap-5 flex-wrap justify-center ">
                    {Array(5).fill(0).map((a, i) => (
                        <div key={i} className="flex flex-col p-3 border-gray-200 border rounded-lg w-60 gap-3">
                            <div className="bg-gray-200 w-20 animate-pulse h-5 rounded-lg" ></div>
                            <div className="bg-gray-200 w-full animate-pulse h-8 rounded-lg" ></div>
                            <div className="bg-gray-200 w-20 animate-pulse h-5 rounded-lg" ></div>
                            <div className="bg-gray-200 w-full animate-pulse h-8 rounded-lg" ></div>
                            <div className="bg-gray-200 w-20 animate-pulse h-5 rounded-lg" ></div>
                            <div className="bg-gray-200 w-full animate-pulse h-8 rounded-lg" ></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    if (userNameLoadable.state == "hasValue") {

        return (
            <Link to="#" className="hover:shadow-md hover:scale-[1.01] transition-all relative block overflow-hidden rounded-lg border border-gray-300 w-60 p-4 sm:p-6 lg:p-8">
                <div className="sm:flex sm:justify-between sm:gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                        $ {historyDetails.amount}
                        </h3>
                    </div>
                    <div>
                        <h3 className="text-base font-normal sm:font-medium text-gray-500 sm:text-lg">
                            {myId == historyDetails.transactionId ? "Send" : "Recieve"}
                        </h3>
                    </div>
                </div>
                <dl className="mt-6 flex flex-col gap-2 sm:gap-4 ">
                    <div className="flex flex-col-reverse">
                        <dd className="text-xs text-gray-500">{userNameLoadable.contents}</dd>
                        <dt className="text-sm font-medium text-gray-600">
                            {myId == historyDetails.transactionId ? "Reciever" : "Sender"}
                        </dt>
                    </div>

                    <div className="flex flex-col-reverse">
                        <dd className="text-xs text-gray-500">{localDate}</dd>
                        <dt className="text-sm font-medium text-gray-600">Time</dt>
                    </div>
                </dl>
            </Link>
        )
    }
}

export default Card