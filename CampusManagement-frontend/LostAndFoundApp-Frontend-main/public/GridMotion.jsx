import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const GridMotion = ({ items = [] }) => {
  const gridRef = useRef(null);
  const rowRefs = useRef([]);
  const mouseXRef = useRef(window.innerWidth / 2);
  const quickToRefs = useRef([]);

  const totalItems = 28;
  const defaultItems = Array.from(
    { length: totalItems },
    (_, index) => `Item ${index + 1}`
  );
  const combinedItems =
    items.length > 0 ? items.slice(0, totalItems) : defaultItems;

  useEffect(() => {
    // Enable reasonable lag smoothing to prevent big jumps after frame drops
    gsap.ticker.lagSmoothing(1000, 16);

    const handleMouseMove = (e) => {
      mouseXRef.current = e.clientX;
    };

    const maxMoveAmount = 300;
    const baseDuration = 0.6;
    const inertiaFactors = [0.55, 0.4, 0.3, 0.22];

    // Initialize quickTo controllers per row to avoid creating tweens each tick
    rowRefs.current.forEach((row, index) => {
      if (row) {
        const duration =
          baseDuration + inertiaFactors[index % inertiaFactors.length];
        quickToRefs.current[index] = gsap.quickTo(row, "x", {
          duration,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    });

    const updateMotion = () => {
      rowRefs.current.forEach((row, index) => {
        if (row && quickToRefs.current[index]) {
          const direction = index % 2 === 0 ? 1 : -1;
          const moveAmount =
            ((mouseXRef.current / window.innerWidth) * maxMoveAmount -
              maxMoveAmount / 2) *
            direction;
          quickToRefs.current[index](moveAmount);
        }
      });
    };

    const removeAnimationLoop = gsap.ticker.add(updateMotion);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      removeAnimationLoop();
    };
  }, []);

  return (
    <div ref={gridRef} className="h-full w-full overflow-hidden">
      <section
        className="w-full h-screen overflow-hidden relative flex items-center justify-center"
        style={{
          background: `#111111`,
        }}
      >
        <div className="absolute inset-0 pointer-events-none z-[4] bg-[length:250px]"></div>
        <div className="gap-4 flex-none relative w-[170vw] h-[150vh] grid grid-rows-4 grid-cols-1 rotate-[-15deg] origin-center z-[2] ">
          {[...Array(4)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-3 grid-cols-7"
              style={{ willChange: "transform, filter" }}
              ref={(el) => (rowRefs.current[rowIndex] = el)}
            >
              {[...Array(7)].map((_, itemIndex) => {
                const content = combinedItems[rowIndex * 7 + itemIndex];
                return (
                  <div key={itemIndex} className="relative">
                    <div className="relative w-full h-full overflow-hidden rounded-[10px] bg-[#111] flex items-center justify-center text-white text-[1.5rem]">
                      {typeof content === "string" &&
                      content.startsWith("http") ? (
                        <div
                          className="w-full h-full bg-cover bg-center absolute top-0 left-0 border border-5"
                          //Added Custom Border for mapped items
                          style={{ backgroundImage: `url(${content})` }}
                        ></div>
                      ) : (
                        <div className="p-4 text-center z-[1]">{content}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="relative w-full h-full top-0 left-0 pointer-events-none"></div>
      </section>
    </div>
  );
};

export default GridMotion;
