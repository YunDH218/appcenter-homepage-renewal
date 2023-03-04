import {Outlet} from "react-router-dom";
import HeaderSwitcher from "../container/home/HeaderSwitcher";
import Footer from "../component/common/Footer";

export default function MainPage() {
    return (
        <>
            <div>
                <HeaderSwitcher/>
            </div>
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </>
    );
}
