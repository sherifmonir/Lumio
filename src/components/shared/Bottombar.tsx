import { bottombarLinks } from "@/constants";
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
                  className={`text-primary-500 flex-center gap-2 ${
                  isActive && " invert-white"
                } `}>
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`size-4  ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </Link>
              
            );
          })}
        
        

    </section>
  )
}

export default Bottombar