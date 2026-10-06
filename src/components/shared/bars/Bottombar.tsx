import {  bottombarLinks } from "@/constants";
import {Link, useLocation} from "react-router-dom";

const Bottombar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">

          {bottombarLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
                <Link
                  to={link.route}
                  key={link.label}
                  className={`gap-2 p-1 ${
                  isActive && "bg-primary-500 rounded-sm"
                } `}>
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`size-4 m-auto ${
                      isActive && "invert-white"
                    }`}
                  />
                </Link>
            );
          })}
        
        

    </section>
  )
}

export default Bottombar