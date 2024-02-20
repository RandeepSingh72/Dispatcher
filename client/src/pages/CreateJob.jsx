import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import { useLocation } from "react-router-dom";

const CreateJob = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const [uplift, setUplift] = useState("");
  const [offload, setOffload] = useState("");
  const [jobStart, setJobStart] = useState("");
  const [size, setSize] = useState("20");
  const [release, setRelease] = useState("");
  const [slot, setSlot] = useState("");
  const [pin, setPin] = useState("");
  const [dg, setDg] = useState("Yes");
  const [weight, setWeight] = useState("");
  const [random, setRandom] = useState("");
  const [doors, setDoors] = useState("");
  const [commodityCode, setCommodityCode] = useState("");
  const [instructions, setInstructions] = useState("");
  const [options, setOptions] = useState([]);

  const [update, setUpdate] = useState('')
 
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://dispatcher-container.onrender.com/api/createJob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uplift,
          offload,
          jobStart,
          size,
          release,
          slot,
          pin,
          random,
          doors,
          commodityCode,
          dg,
          instructions,
          weight,
        }),
      });

      if (response.ok) {
        console.log("Item added successfully!");
        setUplift(""),
          setOffload(""),
          setJobStart(""),
          setSize("20"),
          setRelease(""),
          setSlot(""),
          setPin(""),
          setDoors(""),
          setCommodityCode(""),
          setRandom(""),
          setInstructions(""),
          setDg(""),
          setWeight("");
      } else {
        console.error("Failed to add item.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    // Fetch options from the database
    const fetchOptions = async () => {
      try {
        const response = await fetch(
          "https://dispatcher-container.onrender.com/api/addressOptions",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch options");
        }
        const data = await response.json();
        setOptions(data.addresses);
      } catch (error) {
        console.error("Error fetching uplift options:", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    // Fetch options from the database
    const fetchOptions = async () => {
      try {
        const response = await fetch(
          "https://dispatcher-container.onrender.com/api/addressOptions",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch options");
        }
        const data = await response.json();
        setOptions(data.addresses);
      } catch (error) {
        console.error("Error fetching uplift options:", error);
      }
    };

    fetchOptions();
  }, [update]);



  return (
    <div>
      <Modal isOpen={isOpen} onClose={closeModal} setUpdate={setUpdate} />
      <form
        className="m-5 bg-white p-5 rounded-2xl md:m-10 lg:m-16 xl:m-24"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:px-5 md:pt-5">
          <div>
            <span className="font-semibold">
              Uplift Address{" "}
              {pathname === "/dispatcher-dashboard/create-job" ? (
                <button
                  onClick={openModal}
                  className="btn-link w-50 px-2"
                  type="button"
                >
                  + Add New Address
                </button>
              ) : (
                ""
              )}{" "}
            </span>
            <br />
            <div className="relative flex items-center text-gray-700 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute ml-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>

              <select
                value={uplift}
                onChange={(e) => setUplift(e.target.value)}
                className="py-2 pr-3 pl-10 font-semibold placeholder-gray-500 rounded-xl border-none outline-none bg-purple-70 w-full"
              >
                <option value="" disabled>
                  Uplift Address
                </option>
                {options &&
                  options.map((option) => (
                    <option key={option._id} value={option.address}>
                      {option.address}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <span className="font-semibold">Offload Address</span>
            <br />
            <div className="relative flex items-center text-gray-700 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute ml-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <select
                value={offload}
                onChange={(e) => setOffload(e.target.value)}
                className="py-2 pr-3 pl-10 font-semibold placeholder-gray-500 rounded-xl border-none outline-none bg-purple-70 w-full"
              >
                <option value="" disabled>
                  Offload Address
                </option>
                {options &&
                  options.map((option) => (
                    <option key={option._id} value={option.address}>
                      {option.address}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="start-date" className="font-semibold">
              Start Job Date
            </label>
            <div className="relative flex items-center text-gray-700 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute ml-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>

              <input
                type="date"
                value={jobStart}
                onChange={(e) => setJobStart(e.target.value)}
                placeholder="Enter Start Job Date"
                required
                id="start-date"
                className="py-2 pr-3 pl-10 font-semibold placeholder-gray-500 rounded-xl border-none outline-none bg-purple-70 w-full"
              />
            </div>
          </div>

          <div>
            <span className="font-semibold">Select Size</span>
            <br />
            <div className="relative flex items-center text-gray-700 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute ml-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="py-2 pr-3 pl-10 font-semibold placeholder-gray-500 rounded-xl border-none outline-none bg-purple-70 w-full"
              >
                <option value="20">20ft</option>
                <option value="40">40ft</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="release" className="font-semibold">
              Release
            </label>
            <div className="relative flex items-center text-gray-700 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute ml-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <input
                type="text"
                value={release}
                onChange={(e) => setRelease(e.target.value)}
                placeholder="Release"
                required
                id="release"
                className="py-2 pr-3 pl-10 font-semibold placeholder-gray-500 rounded-xl border-none outline-none bg-purple-70 w-full"
              />
            </div>
          </div>
          <div>
            <label htmlFor="slot" className="font-semibold">
              VBS / Slot
            </label>
            <div className="relative flex items-center text-gray-700 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute ml-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <input
                type="text"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                placeholder="Enter VBS/Slot"
                required
                id="slot"
                className="py-2 pr-3 pl-10 font-semibold placeholder-gray-500 rounded-xl border-none outline-none bg-purple-70 w-full"
              />
            </div>
          </div>
          <div>
            <label htmlFor="pin" className="font-semibold">
              PIN
            </label>
            <div className="relative flex items-center text-gray-700 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute ml-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Pin"
                required
                id="pin"
                className="py-2 pr-3 pl-10 font-semibold placeholder-gray-500 rounded-xl border-none outline-none bg-purple-70 w-full"
              />
            </div>
          </div>
          <div>
            <label htmlFor="random" className="font-semibold">
              Random
            </label>
            <div className="relative flex items-center text-gray-700 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute ml-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <input
                type="text"
                value={random}
                onChange={(e) => setRandom(e.target.value)}
                placeholder="Random"
                required
                id="random"
                className="py-2 pr-3 pl-10 font-semibold placeholder-gray-500 rounded-xl border-none outline-none bg-purple-70 w-full"
              />
            </div>
          </div>
          <div>
            <label htmlFor="doors" className="font-semibold">
              Doors
            </label>
            <div className="relative flex items-center text-gray-700 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute ml-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <input
                type="text"
                value={doors}
                onChange={(e) => setDoors(e.target.value)}
                placeholder="Doors"
                required
                id="doors"
                className="py-2 pr-3 pl-10 font-semibold placeholder-gray-500 rounded-xl border-none outline-none bg-purple-70 w-full"
              />
            </div>
          </div>
          <div>
            <label htmlFor="commodity" className="font-semibold">
              Commodity Code
            </label>
            <div className="relative flex items-center text-gray-700 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute ml-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <input
                type="text"
                value={commodityCode}
                onChange={(e) => setCommodityCode(e.target.value)}
                placeholder="Commodity Code"
                required
                id="commodity"
                className="py-2 pr-3 pl-10 font-semibold placeholder-gray-500 rounded-xl border-none outline-none bg-purple-70 w-full"
              />
            </div>
          </div>
          <div>
            <span className="font-semibold">DG</span>
            <br />
            <div className="relative flex items-center text-gray-700 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute ml-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <select
                value={dg}
                onChange={(e) => setDg(e.target.value)}
                className="py-2 pr-3 pl-10 font-semibold placeholder-gray-500 rounded-xl border-none outline-none bg-purple-70 w-full"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="weight" className="font-semibold">
              Weight
            </label>
            <div className="relative flex items-center text-gray-700 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute ml-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Weight (in Kg)"
                required
                id="weight"
                className="py-2 pr-3 pl-10 font-semibold placeholder-gray-500 rounded-xl border-none outline-none bg-purple-70 w-full"
              />
            </div>
          </div>
        </div>

        <div className="md:px-5 mt-4">
          <label htmlFor="instruction" className="font-semibold">
            Special Instructions
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Special Instructions"
            required
            id="instruction"
            className="mt-2 py-2 px-2 font-semibold placeholder-gray-500 rounded-xl border-none outline-none bg-purple-70 w-full"
          />
        </div>
        <button className="btn my-5 w-50 md:ml-5" type="submit">
          Add Job
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
