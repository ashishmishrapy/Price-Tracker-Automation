import { useEffect, useState } from "react";
import axios from "axios";

const Input = ({ refresh, setRefresh }) => {
  const [url, setUrl] = useState("");
  const [isTrack, setIsTrack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [res, setRes] = useState({
    image: "",
    title: "",
    price: null,
    availability: "",
  });


  useEffect(() => {
  const storedFlag = localStorage.getItem("flag");
  setFlag(storedFlag === "true");
}, []);

  const handleClick = async () => {
    // console.log("Button Clicked");

    if (!url.trim()) {
      alert("Please enter a correct URL.");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/scrape", {
        url,
        isTrack,
      });

      if (isTrack) {
        setRefresh(!refresh)
        localStorage.setItem("flag", "true");
      }

      // console.log(response);

      setRes({
        image: response.data.imageUrl,
        title: response.data.title,
        price: response.data.price,
        availability: response.data.availability,
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:p-5 py-10 space-y-6">
      <span className="font-semibold">Note: </span>
      <span className="text-sm text-gray-700">One user can track only one time</span>
      {/* Input Section */}
      <div className="flex flex-col mt-5 md:flex-row items-center gap-4">
        <input
          type="text"
          disabled={flag}
          placeholder="Enter amazon product URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-2 border rounded-xl w-full md:w-1/2 disabled:cursor-not-allowed outline-none "
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isTrack}
            onChange={() => setIsTrack(!isTrack)}
          />
          <span>Track this product</span>
        </label>

        <button
          onClick={handleClick}
          disabled={loading}
          className="px-2 py-1 disabled:cursor-not-allowed border rounded-xl cursor-pointer"
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="border p-2 text-left">Image</th>
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Price</th>
              <th className="border p-2 text-left">Availability</th>
            </tr>
          </thead>
          {res.title && (
            <tbody>
              <tr>
                <td className="border p-2">
                  {res.image ? (
                    <img
                      src={res.image}
                      alt="Product"
                      className="w-24 object-contain"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="border p-2">{res.title}</td>
                <td className="border p-2">{res.price ?? "—"}</td>
                <td className="border p-2">{res.availability}</td>
              </tr>
            </tbody>
          )}

          {loading && (
            <tbody>
              <tr>
                <td className="border text-gray-700 p-2">Loading....</td>
                <td className="border text-gray-700 p-2">Loading....</td>
                <td className="border text-gray-700 p-2">Loading....</td>
                <td className="border text-gray-700 p-2">Loading....</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default Input;
