import { useState, useMemo } from "react";

export default function BirthdayInvMaker() {
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    dateTime: "",
    text: "",
    bgColor: "blue",
    personImage: null,
    favorImages: [null, null, null, null],
  });
  const corners = ["Top Left", "Top Right", "Bottom Left", "Bottom Right"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type, index = -1) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => {
          if (type === "person") return { ...prev, personImage: reader.result };
          const updatedFavors = [...prev.favorImages];
          updatedFavors[index] = reader.result;
          return { ...prev, favorImages: updatedFavors };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsPreview(true);
  };

  const generateInvitationHTML = () => {
    const { name, address, dateTime, text, bgColor, personImage, favorImages } =
      formData;
    const textColor = ["pink", "yellow"].includes(bgColor)
      ? "text-gray-800"
      : "text-white";
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Birthday Invitation</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
        <style>
          body { 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh; 
            margin: 0; 
            background: #f3f4f6; 
            font-family: 'Noto Sans', sans-serif;
          }
          .invitation { 
            position: relative; 
            width: 500px; 
            height: 700px; 
            overflow: hidden; 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
          }
          img { max-width: 100%; max-height: 100%; object-fit: contain; }
          .corner-img { width: 80px; height: 80px; position: absolute; }
          @media print {
            body { background: none; }
            .invitation { 
              box-shadow: none; 
              width: 100%; 
              height: auto; 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="invitation bg-${bgColor}-300 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center text-center ${textColor}">
          ${
            personImage
              ? `<img src="${personImage}" alt="Birthday Person" class="w-48 h-48 object-cover rounded-full mb-4 border-4 border-white" />`
              : '<div class="w-48 h-48 bg-gray-200 rounded-full mb-4 border-4 border-white"></div>'
          }
          <h1 class="text-4xl font-bold mb-2">${name || "Name"}</h1>
          <p class="text-lg mb-2">${address || "Address"}</p>
          <p class="text-lg mb-4">${dateTime || "Date & Time"}</p>
          <p class="text-base mb-20">${text || "Join us for a celebration!"}</p>
          ${
            favorImages[0]
              ? `<img src="${favorImages[0]}" alt="Favor 1" class="corner-img top-2 left-2" />`
              : ""
          }
          ${
            favorImages[1]
              ? `<img src="${favorImages[1]}" alt="Favor 2" class="corner-img top-2 right-2" />`
              : ""
          }
          ${
            favorImages[2]
              ? `<img src="${favorImages[2]}" alt="Favor 3" class="corner-img bottom-2 left-2" />`
              : ""
          }
          ${
            favorImages[3]
              ? `<img src="${favorImages[3]}" alt="Favor 4" class="corner-img bottom-2 right-2" />`
              : ""
          }
        </div>
      </body>
      </html>
    `;
  };

  const openStandaloneInvitation = () => {
    const htmlContent = generateInvitationHTML();
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, "_blank");
    if (newWindow) {
      newWindow.onload = () => URL.revokeObjectURL(url);
    }
  };

  const handlePrint = () => {
    const htmlContent = generateInvitationHTML();
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      };
    }
  };

  const invitationPreview = useMemo(() => {
    const { name, address, dateTime, text, bgColor, personImage, favorImages } =
      formData;
    const textColor = ["pink", "yellow"].includes(bgColor)
      ? "text-gray-800"
      : "text-white";
    return (
      <div
        className={`relative invitation ${
          bgColor === "blue" ? "bg-blue-300" : ""
        } ${bgColor === "red" ? "bg-red-300" : ""} ${
          bgColor === "green" ? "bg-green-300" : ""
        } ${bgColor === "pink" ? "bg-pink-300 text-white" : ""} ${
          bgColor === "purple" ? "bg-purple-300" : ""
        } ${
          bgColor === "yellow" ? "bg-yellow-300 text-white" : ""
        } rounded-lg shadow-lg p-6 w-full max-w-md mx-auto flex flex-col items-center justify-center text-center ${textColor}`}
      >
        {personImage ? (
          <img
            src={personImage}
            alt="Birthday Person"
            className="w-48 h-48 object-cover rounded-full mb-4 border-4 border-white"
          />
        ) : (
          <div className="w-48 h-48 bg-gray-200 rounded-full mb-4 border-4 border-white"></div>
        )}
        <h1 className="text-4xl font-bold mb-2">{name || "Name"}</h1>
        <p className="text-lg mb-2">{address || "Address"}</p>
        <p className="text-lg mb-4">{dateTime || "Date & Time"}</p>
        <p className="text-base mb-20">
          {text || "Join us for a celebration!"}
        </p>
        {favorImages[0] && (
          <img
            src={favorImages[0]}
            alt="Favor 1"
            className="absolute top-2 left-2 w-20 h-20 object-contain"
          />
        )}
        {favorImages[1] && (
          <img
            src={favorImages[1]}
            alt="Favor 2"
            className="absolute top-2 right-2 w-20 h-20 object-contain"
          />
        )}
        {favorImages[2] && (
          <img
            src={favorImages[2]}
            alt="Favor 3"
            className="absolute bottom-2 left-2 w-20 h-20 object-contain"
          />
        )}
        {favorImages[3] && (
          <img
            src={favorImages[3]}
            alt="Favor 4"
            className="absolute bottom-2 right-2 w-20 h-20 object-contain"
          />
        )}
      </div>
    );
  }, [formData]);

  return (
    <div className=" bg-gray-100 flex items-center justify-center p-4 text-black">
      {!isPreview ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 w-1/2"
        >
          <h2 className="text-2xl font-bold mb-4 text-center ">
            Create Your Birthday Invitation!
          </h2>
          <div className="mb-4 p-2 w-1/2">
            <label
              className="font-semibold block text-gray-700 mb-1"
              htmlFor="name"
            >
              Birthday Person's Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Who's Birthday is it?"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4 p-2 w-1/2">
            <label
              className="font-semibold block text-gray-700 mb-1"
              htmlFor="address"
            >
              Party Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="123 Main Street, Townsville, NY"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4 p-2 w-1/2">
            <label
              className="font-semibold block text-gray-700 mb-1"
              htmlFor="dateTime"
            >
              Date & Time
            </label>
            <input
              type="text"
              id="dateTime"
              name="dateTime"
              placeholder="Friday, May 23rd @ 3:00 PM"
              value={formData.dateTime}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4 p-2 w-1/2">
            <label
              className="font-semibold block text-gray-700 mb-1"
              htmlFor="text"
            >
              Invitation Text
            </label>
            <textarea
              id="text"
              name="text"
              placeholder="You're invited to my Birthday party! We have such an amazing list of activites planned including..."
              value={formData.text}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <div className="mb-4 p-2 w-1/2">
            <label
              className="font-semibold block text-gray-700 mb-1"
              htmlFor="bgColor"
            >
              Background Color
            </label>
            <select
              id="bgColor"
              name="bgColor"
              value={formData.bgColor}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
              <option value="pink">Pink</option>
              <option value="purple">Purple</option>
              <option value="yellow">Yellow</option>
            </select>
          </div>
          <div className="mb-4 p-2  w-1/2">
            <label className="font-semibold block text-gray-700 mb-1">
              Birthday Person's Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "person")}
              className="w-full p-2 border rounded-md"
            />
            {formData.personImage && (
              <div className="mt-2 flex items-center justify-center">
                <img
                  src={formData.personImage}
                  alt="Selected Person"
                  className="w-12 h-12 object-cover rounded-full mr-2"
                />
                <span className="text-sm text-gray-600">Image selected</span>
              </div>
            )}
          </div>
          <div className="mb-4 p-2  w-1/2">
            <label className="font-semibold block text-gray-700 mb-1">
              Party Favor Images (4 Corners)
            </label>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="mb-2">
                <span className="font-semibold text-gray-500 text-sm">
                  {corners[i]} Corner
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "favor", i)}
                  className="w-full p-2 border rounded-md"
                />
                {formData.favorImages[i] && (
                  <div className="mt-2 flex items-center justify-center">
                    <img
                      src={formData.favorImages[i]}
                      alt={`Favor ${i + 1}`}
                      className="w-12 h-12 object-cover rounded-full mr-2"
                    />
                    <span className="text-sm text-gray-600">
                      Image selected
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Create Invitation!
          </button>
        </form>
      ) : (
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Invitation Preview
          </h2>
          {invitationPreview}
          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={openStandaloneInvitation}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              View Invitation
            </button>
            <button
              onClick={() => setIsPreview(false)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              Edit Invitation
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Print Invitation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
