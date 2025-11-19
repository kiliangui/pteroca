import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import { Metadata } from "next";
const inter = Inter({ subsets: ["latin"] });


export const metadata : Metadata = {
  title: "Terms of service",
  description: "terms of services page"
}
export default function App() {
  // Detect if the script is running in the browser
  return (
    <>
      <Head>
        <link rel={"canonical"} href="https://hostchicken.com/privacy" />
      </Head>


      <main className="flex container flex-col gap-2">
      <h1 className="text-4xl font-bold">Terms and conditions</h1>
<p>These terms and conditions (“Agreement”) set forth the general terms and conditions of your use of the <a href="https://hostchicken.com">hostchicken.com</a> website (“Website” or “Service”) and any of its related products and services (collectively, “Services”). This Agreement is legally binding between you (“User”, “you” or “your”) and this Website operator (“Operator”, “we”, “us” or “our”). If you are entering into this Agreement on behalf of a business or other legal entity, you represent that you have the authority to bind such entity to this Agreement, in which case the terms “User”, “you” or “your” shall refer to such entity. If you do not have such authority, or if you do not agree with the terms of this Agreement, you must not accept this Agreement and may not access and use the Website and Services. By accessing and using the Website and Services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Agreement. You acknowledge that this Agreement is a contract between you and the Operator, even though it is electronic and is not physically signed by you, and it governs your use of the Website and Services.</p>
<div className="toc"><h3 className="text-xl font-bold">Table of contents</h3><ol className="toc"><li><a href="#accounts-and-membership">Accounts and membership</a></li><li><a href="#user-content">User content</a></li><li><a href="#backups">Backups</a></li><li><a href="#links-to-other-resources">Links to other resources</a></li><li><a href="#changes-and-amendments">Changes and amendments</a></li><li><a href="#acceptance-of-these-terms">Acceptance of these terms</a></li><li><a href="#contacting-us">Contacting us</a></li></ol></div>
<h2 className="text-2xl font-bold"id="accounts-and-membership">Accounts and membership</h2>
<p>If you create an account on the Website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it. We may, but have no obligation to, monitor and review new accounts before you may sign in and start using the Services. Providing false contact information of any kind may result in the termination of your account. You must immediately notify us of any unauthorized uses of your account or any other breaches of security. We will not be liable for any acts or omissions by you, including any damages of any kind incurred as a result of such acts or omissions. We may suspend, disable, or delete your account (or any part thereof) if we determine that you have violated any provision of this Agreement or that your conduct or content would tend to damage our reputation and goodwill. If we delete your account for the foregoing reasons, you may not re-register for our Services. We may block your email address and Internet protocol address to prevent further registration.</p>
<h2 className="text-2xl font-bold"id="user-content">User content</h2>
<p>We do not own any data, information or material (collectively, “Content”) that you submit on the Website in the course of using the Service. You shall have sole responsibility for the accuracy, quality, integrity, legality, reliability, appropriateness, and intellectual property ownership or right to use of all submitted Content. We may, but have no obligation to, monitor and review the Content on the Website submitted or created using our Services by you. You grant us permission to access, copy, distribute, store, transmit, reformat, display and perform the Content of your user account solely as required for the purpose of providing the Services to you. Unless specifically permitted by you, your use of the Website and Services does not grant us the license to use, reproduce, adapt, modify, publish or distribute the Content created by you or stored in your user account for commercial, marketing or any similar purpose.</p>
<h2 className="text-2xl font-bold"id="backups">Backups</h2>
<p>We are not responsible for the Content residing on the Website. In no event shall we be held liable for any loss of any Content. It is your sole responsibility to maintain appropriate backup of your Content. Notwithstanding the foregoing, on some occasions and in certain circumstances, with absolutely no obligation, we may be able to restore some or all of your data that has been deleted as of a certain date and time when we may have backed up data for our own purposes. We make no guarantee that the data you need will be available.</p>
<h2 className="text-2xl font-bold"id="premium-subscription-and-ads">Premium Subscription and Ad Display</h2> <p>The Website offers an optional premium subscription service (“Premium Subscription”) that provides Users with enhanced features and benefits, including an ad-free experience. By subscribing to the Premium Subscription, you agree to pay the applicable subscription fees in accordance with the terms presented at the time of subscription. The subscription fee is non-refundable except as required by applicable law or as otherwise specified in this Agreement.</p> <p>As a standard user of the Website, you acknowledge that advertisements may be displayed during your use of the Services. We do not endorse or assume any responsibility for the content or services advertised. If you do not wish to see ads, you may choose to subscribe to the Premium Subscription, which will remove such ads from your viewing experience. The terms of the Premium Subscription, including its features, pricing, and availability, are subject to change at our discretion, with prior notice provided where possible.</p> <p>Unauthorized attempts to circumvent the display of advertisements without an active Premium Subscription, through any technological or manual means, may result in the suspension or termination of your account and access to the Services.</p>

<h2 className="text-2xl font-bold"id="links-to-other-resources">Links to other resources</h2>
<p>Although the Website and Services may link to other resources (such as websites, mobile applications, etc.), we are not, directly or indirectly, implying any approval, association, sponsorship, endorsement, or affiliation with any linked resource, unless specifically stated herein. We are not responsible for examining or evaluating, and we do not warrant the offerings of, any businesses or individuals or the content of their resources. We do not assume any responsibility or liability for the actions, products, services, and content of any other third parties. You should carefully review the legal statements and other conditions of use of any resource which you access through a link on the Website. Your linking to any other off-site resources is at your own risk.</p>
<h2 className="text-2xl font-bold"id="changes-and-amendments">Changes and amendments</h2>
<p>We reserve the right to modify this Agreement or its terms related to the Website and Services at any time at our discretion. When we do, we will revise the updated date at the bottom of this page. We may also provide notice to you in other ways at our discretion, such as through the contact information you have provided.</p>
<p>An updated version of this Agreement will be effective immediately upon the posting of the revised Agreement unless otherwise specified. Your continued use of the Website and Services after the effective date of the revised Agreement (or such other act specified at that time) will constitute your consent to those changes.</p>
<h2 className="text-2xl font-bold"id="acceptance-of-these-terms">Acceptance of these terms</h2>
<p>You acknowledge that you have read this Agreement and agree to all its terms and conditions. By accessing and using the Website and Services you agree to be bound by this Agreement. If you do not agree to abide by the terms of this Agreement, you are not authorized to access or use the Website and Services.</p>
<h2 className="text-2xl font-bold"id="contacting-us">Contacting us</h2>
<p>If you have any questions, concerns, or complaints regarding this Agreement, we encourage you to contact us using the details below:</p>
<p><a href="&#109;&#097;&#105;&#108;&#116;&#111;&#058;kili&#97;&#110;&#103;uill&#111;&#116;&#101;&#97;&#117;&#120;&#64;g&#109;a&#105;l.c&#111;&#109;">ki&#108;ian&#103;ui&#108;&#108;&#111;&#116;&#101;&#97;ux&#64;&#103;&#109;&#97;il.&#99;&#111;&#109;</a></p>
<p>This document was last updated on November 13, 2024</p>
      </main>
    </>
  );
}
