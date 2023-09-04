import "@/styles/globals.css";
// import App from "next/app";
// import { validateToken } from "../../utils/auth";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// MyApp.getInitialProps = async ({ Component, ctx }) => {
//   // Check for token on protected pages
//   const token = ctx.req.cookies.token || null;
//   const isProtectedPage = Component.isProtectedPage || false;
//   if (isProtectedPage && !validateToken(token)) {
//     // Redirect to login page if token is not present or invalid
//     ctx.res.writeHead(302, { Location: "/login" });
//     ctx.res.end();
//   }

//   let pageProps = {};
//   if (Component.getInitialProps) {
//     pageProps = await Component.getInitialProps(ctx);
//   }
//   return { pageProps };
// };

export default MyApp;
