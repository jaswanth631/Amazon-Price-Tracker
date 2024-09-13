interface SearchFormProps {
  scrapDataa: (e: any) => void;
  url: string;
  setUrl: (value: string) => void;
  isLoading: boolean; // Add loading state as a prop
}

const SearchForm: React.FC<SearchFormProps> = ({
  scrapDataa,
  url,
  setUrl,
  isLoading,
}) => {
  return (
    <form>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-2 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="block w-[40rem] p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter the Amazon product link..."
          required
        />
        <button
          type="submit"
          onClick={scrapDataa}
          className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? ( // Change the button text based on the loading state
            <>
              <svg
                aria-hidden="true"
                role="status"
                className="inline mr-2 w-4 h-4 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591 22.3858 100.591 0 78.2051 0 50.5908 0 22.9766 22.3858 0.59082 50 0.59082 77.6142 0.59082 100 22.9766 100 50.5908ZM9.08197 50.5908C9.08197 74.389 25.702 91.0091 49.5 91.0091 73.298 91.0091 89.918 74.389 89.918 50.5908 89.918 26.7926 73.298 10.1726 49.5 10.1726 25.702 10.1726 9.08197 26.7926 9.08197 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5537 95.2932 28.8227 92.871 24.3692 89.8167 20.348 85.8452 15.1192 80.8826 10.723 75.2124 7.41281 69.5422 4.10261 63.2754 1.94025 56.7688 1.05189 51.7667 0.367777 46.6974 0.91999 41.807 2.68452 39.3185 3.56778 38.2561 6.37754 38.8932 8.80298 39.5303 11.2284 42.0144 12.2458 44.4502 11.6845 48.6356 10.7569 52.9521 10.3997 57.2302 10.6448 62.7279 10.9559 67.9286 12.6425 72.5664 15.5615 76.8316 18.3085 80.6549 22.2515 83.6612 27.0804 86.6687 31.9094 88.783 37.4822 89.8856 43.4464 90.1417 46.3479 91.5205 47.5763 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Searching...
            </>
          ) : (
            "Search"
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
