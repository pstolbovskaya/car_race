//import './style.scss'
//import typescriptLogo from './typescript.svg'
//import viteLogo from '/vite.svg'

import { FooterComponent } from "./components/footerComponent";
import { HeaderComponent } from "./components/headerComponent";
import { MainComponent } from "./components/mainComponent"

//import { setupCounter } from './counter.ts'
const main: MainComponent = new MainComponent();
const header: HeaderComponent = new HeaderComponent();
const footer: FooterComponent = new FooterComponent();

document.body.append(header.getNode());
document.body.append(main.getNode());
document.body.append(footer.getNode());
//document.body.append()