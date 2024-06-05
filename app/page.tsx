export default function Home() {
  return (
    <main
      className="bg-gray-100 h-screen 
      sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100
      flex items-center justify-center p-5 
    dark:bg-gray-700
    "
    >
      <div
        className="bg-white shadow-lg p-5 rounded-3xl w-full max-w-screen-sm flex flex-col gap-2
      dark:bg-gray-600 md:flex-row *:outline-none ring ring-transparent transition-shadow has-[:invalid]:ring-red-100  has-[:invalid]:ring
      "
      >
        <input
          className="w-full rounded-full h-10 bg-gray-200 pl-5  ring
        ring-transparent focus:ring-green-500 focus:ring-offset-2 transition-shadow
        placeholder:drop-shadow invalid:focus:ring-red-500 peer
        "
          type="text"
          placeholder="Email address"
          required
        ></input>
        <span className="text-red-500 font-medium hidden peer-invalid:block">
          {" "}
          Email is required.
        </span>
        <button
          className="bg-black text-white py-2 rounded-full font-medium
        active:scale-90 md:px-10  transition-transform  peer-invalid:bg-red-100 peer-required:bg-green-500
        "
        >
          Login
        </button>
      </div>
    </main>
  );
}
