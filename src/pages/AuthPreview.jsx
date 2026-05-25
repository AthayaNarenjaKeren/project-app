function AuthPreview() {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-4">
          Auth Layout Preview
        </h1>
  
        <p className="text-gray-500 mb-8">
          Tampilan rancangan autentikasi sistem.
        </p>
  
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-4 rounded-xl mb-4"
        />
  
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-4 rounded-xl mb-4"
        />
  
        <button className="w-full bg-blue-500 text-white py-4 rounded-xl">
          Login
        </button>
      </div>
    );
  }
  
  export default AuthPreview;