import { useState, ChangeEvent, FormEventHandler } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "./assets/phone.css";
import axios from "axios";
import optimum from "./assets/skylight.png";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

function App(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const [phone, setPhone] = useState("");
  console.log(phone);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      // Form validation
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        phone.trim() === ""
      ) {
        setError("All fields are required");
        return;
      }

      const dataToBeSent = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone,
      };
      setLoading(true);
      // Axios request
      const makeCall = await axios.post(
        "http://localhost:3000/api/calls/make-a-call",
        dataToBeSent
      );
      setLoading(false);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
      });
      setPhone("");
      setError("");

      const scheduleAppointment = await axios.post(
        `http://localhost:3000/api/meetings/schedule-metting/${makeCall.data.callId}`,
        { name: dataToBeSent.name, email: dataToBeSent.email }
      );
      console.log(scheduleAppointment);
    } catch (error) {
      // Handle error
      setLoading(false);
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-[100vw] relative overflow-hidden max-h-screen bg-[white]">
      <div className="absolute left-[25vw] right-[25vw] top-[7.5%] z-120 w-[50vw] bg-white h-[85%] shadow-lg shadow-[#6e6e6e] rounded-md p-10 flex flex-col items-center">
        <h1 className="font-montserrat font-bold text-[2.3rem]">
          Want to Know More?
        </h1>
        <h3 className="font-montserrat font-semibold text-[0.9rem]">
          We call you immediately
        </h3>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex justify-between w-full">
            <div className="w-[50%] flex justify-center items-center">
              <img
                src={optimum}
                alt=""
                className="w-[70%] top-[-10%] relative"
              />
            </div>
            <div className="w-[46%] pt-10">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                placeholder="First Name"
                className="w-full border border-gray-400 outline-none mb-6 h-[3rem] rounded-lg px-2"
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                placeholder="Last Name"
                className="w-full border border-gray-400 outline-none mb-6 h-[3rem] rounded-lg px-2"
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="What's your email"
                className="w-full border border-gray-400 outline-none mb-6 h-[3rem] rounded-lg px-2"
                onChange={handleChange}
              />
              <div className="flex w-full border items-center border-gray-400 outline-none mb-6 h-[3rem] rounded-lg pl-2">
                <PhoneInput
                  className="phone"
                  defaultCountry="gh"
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  placeholder="567901234"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 text-white font-montserrat bg-[#004589] rounded-lg mb-1 ${
                  loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
              <p className="text-rose-500 text-[0.8rem]">{error}</p>
            </div>
          </div>
        </form>
      </div>
      <div className="w-full blur-[2px]">
        <div className="w-full h-[70vh] bg-[#004589]"></div>
        <div className="h-[30vh] w-[120%] relative top-[-5rem] rotate-[-5deg] bg-[white]"></div>
      </div>
    </div>
  );
}

export default App;
