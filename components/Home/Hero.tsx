"use client";
import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

export default function Hero(): JSX.Element {
  const [search, setSearch] = useState<string>("");
  const [propertyType, setPropertyType] = useState<"apartments" | "plots">("apartments");
  const router = useRouter();

  const handleSearch = (): void => {
    if (!search.trim()) return;
    router.push(`/properties?search=${encodeURIComponent(search)}&type=${propertyType}`);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section id="home-banner" className="relative overflow-x-hidden">
      {/* Background Section */}
      <div className="bg-[#ECF1F8] relative py-2 lg:py-4 pb-24 md:pb-28 xl:pb-32">
        <div className="w-full lg:max-w-[1280px] mx-auto px-4 lg:w-[85%]">

          {/* Headline */}
          <div className="pb-4 md:pb-20 xl:pb-24 2xl:pb-32">
            <div className="pt-4 md:pt-4 pb-4 md:pb-6 text-center md:text-left">
              <div className="relative z-10">
                <h1 className="text-[32px] md:text-[38px] font-bold font-montserrat text-[#234E70] lg:text-[56px] lg:leading-[64px]">
                  Buy Homes Directly <br />
                  <span className="text-[#0E8744]">With Builders</span>
                </h1>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-[#DEE3E9] p-4 w-full sm:w-auto rounded-full inline-flex justify-center items-center gap-2 sm:gap-4 relative z-20">
              <div className="flex gap-2">
                <img
                  alt=""
                  src="/assets/image/hand-shake.webp"
                  className="size-5 md:size-7"
                />
                <h2 className="font-jost font-semibold text-[#0E8744] text-[14px] md:text-[18px]">
                  No Brokerage
                </h2>
              </div>
              <div className="w-[1px] h-5 md:h-7 bg-[#0E8744] rounded-full" />
              <div className="flex gap-2">
                <img
                  alt=""
                  src="/assets/image/best-deal.webp"
                  className="object-contain w-5 h-5 md:w-7 md:h-7"
                />
                <h2 className="font-jost font-semibold text-[#0E8744] text-[14px] md:text-[18px]">
                  Bottom Rate Policy
                </h2>
              </div>
            </div>
          </div>

          {/* Background Buildings - Desktop */}
          <div className="hidden lg:block absolute bottom-0 left-0 w-full h-auto pointer-events-none select-none" aria-hidden="true">
            <img
              alt="City skyline background"
              src="/assets/image/background-buildings.webp"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Background Buildings - Tablet */}
          <div className="hidden sm:block lg:hidden absolute bottom-0 left-0 w-full h-[260px] pointer-events-none select-none" aria-hidden="true">
            <img
              alt="City skyline background"
              src="/assets/image/background-buildings-tablet.webp"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Hero Image - Right Side Desktop */}
          <div className="absolute -bottom-6 lg:-bottom-12 right-0 2xl:right-28 hidden md:block">
            <img
              alt="housiey"
              src="/assets/image/home-banner.webp"
              className="md:w-[450px] lg:w-[600px] xl:w-[700px] 2xl:w-[800px] object-contain"
              sizes="(min-width: 1536px) 800px, (min-width: 1280px) 700px, (min-width: 1024px) 600px, (min-width: 768px) 450px, 100vw"
            />
          </div>

          {/* Hero Image - Mobile */}
          <div className="mt-48 md:hidden"></div>
          <div className="w-full absolute bottom-10 h-60 md:hidden -ml-4">
            <img
              alt="housiey"
              src="/assets/image/home-banner-mobile.webp"
              className="w-full max-w-[400px] h-auto object-cover float-end"
              sizes="(max-width: 768px) 100vw, 480px"
            />
          </div>
        </div>
      </div>

      {/* Search Component - Positioned Over Background */}
      <div className="w-full lg:max-w-[1280px] mx-auto px-4 absolute left-1/2 -translate-x-1/2 -translate-y-2/5 md:-translate-y-1/2 lg:w-[85%] z-30">
        <div className="flex flex-col md:flex-row md:items-end">

          {/* Left Side - Tabs + Input */}
          <div className="w-full md:w-80 relative">
            <div className="flex flex-col gap-0 w-full">

              {/* Property Type Tabs */}
              <div
                role="tablist"
                className="text-[#9e9e9e] items-center justify-center rounded-lg p-[3px] grid w-full h-full grid-cols-2 gap-1 pt-1 px-0 -mb-[15px] rounded-bl-none rounded-br-none bg-transparent"
              >
                {/* Apartment Tab */}
                <button
                  type="button"
                  role="tab"
                  aria-selected={propertyType === "apartments"}
                  onClick={() => setPropertyType("apartments")}
                  className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 font-medium whitespace-nowrap transition-all cursor-pointer border-0 text-[16px] h-12 border-b-3 rounded-t-2xl ${propertyType === "apartments"
                      ? "text-[#0E8744] bg-[#e6f2ec] border-b-3 border-[#0E8744]"
                      : "text-[#9e9e9e] bg-white border-b-3 border-[#9e9e9e]"
                    }`}
                >
                  <svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-5">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.0208 23.7915H20.8285V6.25585L12.0208 4.01776V23.7915ZM17.1608 20.0609V18.9704H18.648V20.0609H17.1608ZM13.861 20.0609V18.9704H15.3482V20.0609H13.861ZM17.1608 17.409V16.3185H18.648V17.409H17.1608ZM13.861 17.409V16.3185H15.3482V17.409H13.861ZM17.1608 14.7571V13.6666H18.648V14.7571H17.1608ZM13.861 14.7571V13.6666H15.3482V14.7571H13.861ZM17.1608 12.1052V11.0148H18.648V12.1052H17.1608ZM13.861 12.1052V11.0148H15.3482V12.1052H13.861Z" fill="currentColor" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M0 23.7914H3.01233V19.0696C3.01233 18.9249 3.06981 18.7861 3.17213 18.6838C3.27444 18.5815 3.41322 18.524 3.55792 18.524H7.37216C7.51686 18.524 7.65563 18.5815 7.75794 18.6838C7.86026 18.7861 7.91774 18.9249 7.91774 19.0696V23.7914H10.9301V0L0 2.96412V23.7914ZM1.40434 16.7742V15.6837H2.8916V16.7742H1.40434ZM1.40434 14.1119V13.0214H2.8916V14.1119H1.40434ZM1.40434 11.4601V10.3696H2.8916V11.4601H1.40434ZM1.40434 8.80824V7.71776H2.8916V8.80804L1.40434 8.80824ZM1.40434 6.15639V5.06591H2.8916V6.15639H1.40434ZM8.03757 16.7742V15.6837H9.52553V16.7742H8.03757ZM4.73767 16.7742V15.6837H6.22494V16.7742H4.73767ZM8.03757 14.1119V13.0214H9.52553V14.1119H8.03757ZM4.73767 14.1119V13.0214H6.22494V14.1119H4.73767ZM8.03757 11.4601V10.3696H9.52553V11.4601H8.03757ZM4.73767 11.4601V10.3696H6.22494V11.4601H4.73767ZM8.03757 8.80804V7.71776H9.52553V8.80804H8.03757ZM4.73767 8.80804V7.71776H6.22494V8.80804H4.73767ZM8.03757 6.15639V5.06591H9.52553V6.15639H8.03757ZM4.73767 6.15639V5.06591H6.22494V6.15639H4.73767Z" fill="currentColor" />
                    <path d="M4.10242 19.6166H6.82628V23.7933H4.10242V19.6166Z" fill="white" />
                  </svg>
                  Apartment
                </button>

                {/* Plots Tab - Coming Soon */}
                <button
                  type="button"
                  role="tab"
                  aria-selected={propertyType === "plots"}
                  disabled
                  className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 font-medium whitespace-nowrap transition-all cursor-not-allowed border-0 text-[16px] h-12 border-b-3 rounded-t-2xl disabled:opacity-60 ${propertyType === "plots"
                      ? "text-[#0E8744] bg-[#e6f2ec] border-b-3 border-[#0E8744]"
                      : "text-[#9e9e9e] bg-white border-b-3 border-[#9e9e9e]"
                    }`}
                >
                  <svg width="25" height="24" viewBox="0 0 25 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="size-5">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.3683 13.2731C10.6892 11.3248 7.95105 8.49251 7.95105 6.10239C7.95105 3.54764 10.0221 1.47656 12.5769 1.47656C15.1317 1.47656 17.2027 3.54759 17.2027 6.10234C17.2027 8.49246 14.4645 11.3247 12.7854 13.2731C12.7313 13.3359 12.6599 13.3686 12.5769 13.3686C12.4939 13.3686 12.4225 13.3359 12.3683 13.2731ZM12.2097 20.0303C12.2097 19.8275 12.3741 19.6631 12.5769 19.6631C12.7797 19.6631 12.9441 19.8275 12.9441 20.0303V21.6601C12.9441 21.8629 12.7797 22.0273 12.5769 22.0273C12.3741 22.0273 12.2097 21.8629 12.2097 21.6601V20.0303ZM23.7446 14.8531C23.9283 14.937 24.0092 15.1541 23.9253 15.3378C23.8413 15.5216 23.6242 15.6025 23.4405 15.5185L21.8109 14.7748C21.6271 14.6909 21.5463 14.4738 21.6302 14.29C21.7142 14.1063 21.9312 14.0253 22.115 14.1093L23.7446 14.8531ZM1.71331 15.5186C1.52953 15.6025 1.31248 15.5217 1.22848 15.3379C1.14454 15.1541 1.22541 14.9371 1.40919 14.8531L3.03876 14.1094C3.22254 14.0254 3.4396 14.1063 3.52354 14.2901C3.60749 14.4739 3.52662 14.6909 3.34284 14.7749L1.71331 15.5186ZM19.6802 14.6079L12.7289 17.7805C12.6283 17.8265 12.5178 17.823 12.4246 17.7804L5.47354 14.6079L4.77951 14.9247L12.5769 18.4834L20.3742 14.9246L19.6802 14.6079ZM20.3742 13.4868L15.4834 11.2545C14.7407 12.1823 13.9591 13.0362 13.3418 13.7525C13.1481 13.9772 12.8736 14.103 12.5769 14.103C12.2803 14.103 12.0057 13.9772 11.8121 13.7525C11.1947 13.0361 10.4132 12.1823 9.67045 11.2545L4.77951 13.4868L12.5769 17.0455L20.3742 13.4868ZM12.5769 3.11289C10.9258 3.11289 9.58737 4.45133 9.58737 6.10239C9.58737 7.75345 10.9258 9.09189 12.5769 9.09189C14.2279 9.09189 15.5664 7.75345 15.5664 6.10239C15.5664 4.45129 14.2279 3.11289 12.5769 3.11289Z" fill="currentColor" />
                  </svg>
                  Plots
                  <span className="text-[10px] rounded text-white font-semibold absolute -top-2 -right-2 py-0.5 px-1.5 bg-[linear-gradient(to_right,_#234e70,_#0e9744)] animate-pulse tracking-wider z-10">
                    Coming Soon
                  </span>
                </button>
              </div>

              {/* Search Input Area */}
              <div className="bg-white md:rounded-bl-2xl py-2 px-4 mt-3 h-auto md:h-32 xl:h-40">
                <div className="flex-1 flex items-center relative">
                  <div className="flex-1">
                    <div className="w-full relative">
                      <div className="relative">
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Search for Project, locality or builder"
                          className="w-full bg-[#F5F5F5] text-[14px] md:text-[16px] py-3 px-3 pr-10 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#0E8744] placeholder:text-[#9e9e9e]"
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer size-4 text-[#0E8744]"
                          onClick={handleSearch}
                        >
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="m21 21-4.3-4.3"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Popular Localities */}
                <div className="flex flex-col lg:flex-row gap-1 lg:gap-4 mt-3">
                  <div className="flex gap-1 items-center mb-2 md:mb-0">
                    <h2 className="text-[14px] md:text-[16px] font-jost font-semibold text-[#234E70]">
                      Popular Localities
                    </h2>
                    <svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4">
                      <path d="M16.932 1.01642C16.8458 0.812891 16.6808 0.651156 16.4732 0.566634C16.371 0.523954 16.2613 0.501316 16.1502 0.5H11.9015C11.6761 0.5 11.46 0.587755 11.3006 0.74396C11.1413 0.900165 11.0517 1.11202 11.0517 1.33293C11.0517 1.55384 11.1413 1.7657 11.3006 1.9219C11.46 2.07811 11.6761 2.16586 11.9015 2.16586H14.1023L9.35222 6.82195L6.55653 4.07327C6.47753 3.9952 6.38355 3.93324 6.28 3.89095C6.17645 3.84867 6.06538 3.82689 5.9532 3.82689C5.84103 3.82689 5.72996 3.84867 5.62641 3.89095C5.52286 3.93324 5.42887 3.9952 5.34988 4.07327L0.251356 9.07086C0.17171 9.14829 0.108493 9.24041 0.0653519 9.34191C0.0222111 9.44341 0 9.55228 0 9.66224C0 9.7722 0.0222111 9.88106 0.0653519 9.98256C0.108493 10.0841 0.17171 10.1762 0.251356 10.2536C0.330351 10.3317 0.424335 10.3937 0.527885 10.4359C0.631436 10.4782 0.742503 10.5 0.854681 10.5C0.966858 10.5 1.07793 10.4782 1.18148 10.4359C1.28503 10.3937 1.37901 10.3317 1.45801 10.2536L5.9532 5.83909L8.74889 8.58776C8.82789 8.66583 8.92187 8.72779 9.02542 8.77008C9.12897 8.81237 9.24004 8.83414 9.35222 8.83414C9.46439 8.83414 9.57546 8.81237 9.67901 8.77008C9.78256 8.72779 9.87655 8.66583 9.95554 8.58776L15.3005 3.34029V5.49759C15.3005 5.71849 15.39 5.93035 15.5494 6.08656C15.7087 6.24276 15.9249 6.33052 16.1502 6.33052C16.3756 6.33052 16.5918 6.24276 16.7511 6.08656C16.9105 5.93035 17 5.71849 17 5.49759V1.33293C16.9987 1.22409 16.9756 1.11655 16.932 1.01642Z" fill="#234E70" />
                    </svg>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* Example chips - replace with dynamic data */}
                    {["Kharghar", "Panvel", "Navi Mumbai", "Thane"].map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setSearch(loc);
                          handleSearch();
                        }}
                        className="text-[12px] md:text-[14px] px-3 py-1 bg-[#ECF1F8] text-[#234E70] rounded-full hover:bg-[#0E8744] hover:text-white transition-colors"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Search Button */}
          <div className="flex-1 bg-white p-4 md:px-8 h-auto md:h-32 xl:h-40 md:border-l md:rounded-tr-2xl rounded-br-2xl rounded-bl-2xl md:rounded-bl-none grid place-items-center -mt-2 md:mt-0">
            <button
              onClick={handleSearch}
              className="bg-[#0E8744] hover:bg-[#0c7a3d] text-white px-8 py-3 rounded-full font-semibold text-[16px] transition-colors shadow-md hover:shadow-lg w-full md:w-auto"
            >
              Search Properties
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}