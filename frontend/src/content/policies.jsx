import { Link } from 'react-router-dom';
import { SITE } from '../config/site';

const Contact = () => (
  <p>
    Email us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
    {SITE.phone ? <> or call {SITE.phone}</> : null}.
  </p>
);

function Privacy() {
  return (
    <>
      <p>This policy explains what personal information {SITE.legalName} ("we", "us") collects when you use our website, why we collect it, and the choices you have.</p>

      <h2>1. Information we collect</h2>
      <ul>
        <li><b>Account details:</b> your name, email address, mobile number and password. Passwords are stored in a scrambled (hashed) form, so we cannot read them.</li>
        <li><b>Order details:</b> the products you order, your shipping address, and your order and payment status.</li>
        <li><b>Technical data:</b> your IP address, browser type and basic server logs, used to keep the site secure and working.</li>
      </ul>

      <h2>2. How we use it</h2>
      <ul>
        <li>To create your account, process and deliver your orders, and send order-related emails such as order confirmations and password reset links.</li>
        <li>To answer your questions and handle returns, refunds and complaints.</li>
        <li>To protect the site against fraud and misuse, and to meet legal, tax and accounting requirements.</li>
      </ul>

      <h2>3. Payments</h2>
      <p>Online payments are processed by Razorpay. Your card, UPI and net banking details are entered on Razorpay's secure page. We never see or store them. We only receive confirmation of whether your payment succeeded.</p>

      <h2>4. Who we share it with</h2>
      <p>We do not sell your personal information. We share only what is needed with the services that help us run the store: courier and shipping partners (your name, phone number and address, to deliver your parcel), our payment gateway, our email delivery service, and our hosting and database providers. We may also disclose information when the law requires it.</p>

      <h2>5. Cookies</h2>
      <p>We use only essential cookies that keep you logged in securely. They are not used for advertising or tracking across other websites. If we add analytics or advertising tools in future, we will update this policy first.</p>

      <h2>6. Security</h2>
      <p>We use encrypted connections (HTTPS), hashed passwords and protected login cookies. No system is completely secure, but we work to protect your information and limit who can access it.</p>

      <h2>7. How long we keep it</h2>
      <p>We keep your account details while your account is active. We keep order records for as long as needed for delivery, support and to meet tax and accounting laws.</p>

      <h2>8. Your rights</h2>
      <p>You can ask us to show you the personal information we hold about you, correct it, or delete your account and data (except records we must legally keep). Write to us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we will respond within a reasonable time, in line with applicable Indian data protection law.</p>

      <h2>9. Children</h2>
      <p>Our store is meant for adults. We do not knowingly collect information from anyone under 18.</p>

      <h2>10. Changes to this policy</h2>
      <p>We may update this policy from time to time. The date at the top shows when it was last changed.</p>

      <h2>11. Grievance Officer</h2>
      <p>{SITE.grievance.name}, {SITE.grievance.designation}<br />Email: <a href={`mailto:${SITE.grievance.email}`}>{SITE.grievance.email}</a><br />Address: {SITE.address}</p>
      <p>We acknowledge complaints within 48 hours and aim to resolve them within one month.</p>
    </>
  );
}

function Shipping() {
  return (
    <>
      <h2>1. Where we deliver</h2>
      <p>We deliver across India through our courier partners. If your pincode cannot be served, we will contact you and cancel the order with a full refund.</p>

      <h2>2. Shipping charges</h2>
      <p>Shipping is <b>free on orders of ₹{SITE.freeShippingAbove} and above</b>. For orders below ₹{SITE.freeShippingAbove}, a flat shipping fee of ₹{SITE.shippingFee} applies. The exact amount is shown at checkout before you pay.</p>

      <h2>3. Processing and delivery time</h2>
      <ul>
        <li>Orders are packed and handed to the courier within {SITE.processingTime} of being placed.</li>
        <li>Delivery usually takes {SITE.deliveryTime} after dispatch, depending on your location.</li>
        <li>Delays can happen because of weather, festivals, strikes or courier issues that are outside our control.</li>
      </ul>

      <h2>4. Tracking your order</h2>
      <p>Once your order ships, the courier name and tracking number appear on our <Link to="/track-order">Track Order</Link> page. Enter your order number and the mobile number you used at checkout. You can also find your orders under <Link to="/account/orders">My orders</Link> after you log in.</p>

      <h2>5. Address and delivery attempts</h2>
      <p>Please give a complete and correct address and a working mobile number. If a delivery fails because of a wrong address or because nobody could receive the parcel, the courier may return it to us, and we may ask you to pay the shipping again to resend it.</p>

      <h2>6. Damaged or wrong parcels</h2>
      <p>Please check your parcel when it arrives. If it looks damaged or opened, tell us within {SITE.reportWindow} of delivery. See our <Link to="/policy/refund-policy">Refund and Return Policy</Link> for how this works.</p>

      <h2>7. Questions</h2>
      <Contact />
    </>
  );
}

function Refund() {
  return (
    <>
      <p>Our products are herbs, powders, spices, dry fruits and other consumables. For hygiene and safety, we cannot take back products once they are delivered, except in the cases below.</p>

      <h2>1. When we will replace or refund</h2>
      <ul>
        <li>The product arrived damaged or leaking.</li>
        <li>You received a different product or variant than the one you ordered.</li>
        <li>The product is expired, spoiled or has a quality problem.</li>
        <li>Items are missing from your order.</li>
      </ul>

      <h2>2. How to report a problem</h2>
      <p>Email us within <b>{SITE.reportWindow}</b> of delivery with your order number, a short description, and clear photos or a video of the parcel and product. Keep the packaging until we have replied. We will review your request and, if it is approved, send a replacement or refund the amount.</p>

      <h2>3. What we cannot accept</h2>
      <ul>
        <li>Products that have been opened, used or partly consumed, unless there is a quality problem.</li>
        <li>Change of mind, or a difference in taste, smell or colour that comes naturally with herbs.</li>
        <li>Problems reported after {SITE.reportWindow}, or without photos or video.</li>
      </ul>

      <h2>4. How refunds are paid</h2>
      <ul>
        <li><b>Online payments:</b> the refund goes back to the original payment method within {SITE.refundTime} after approval.</li>
        <li><b>Cash on Delivery:</b> we will ask for your UPI ID or bank details and send the refund there within {SITE.refundTime} after approval.</li>
        <li>Your bank may take a few extra days to show the amount.</li>
      </ul>

      <h2>5. Cancelling an order</h2>
      <p>To cancel an order before it ships, see our <Link to="/policy/cancellation-policy">Cancellation Policy</Link>.</p>

      <h2>6. Contact</h2>
      <Contact />
    </>
  );
}

function Cancellation() {
  return (
    <>
      <h2>1. Cancelling an order yourself</h2>
      <p>You can cancel an order on your own from <Link to="/account/orders">My orders</Link> while its status is <b>Placed</b>. Once your order is packed, it can no longer be cancelled online.</p>

      <h2>2. After your order is packed or shipped</h2>
      <p>If your order is already packed or on its way, please write to us. We will try to help, but we cannot promise a cancellation once the parcel has been handed to the courier. If you receive a parcel with a problem, our <Link to="/policy/refund-policy">Refund and Return Policy</Link> applies.</p>

      <h2>3. When we cancel an order</h2>
      <p>We may cancel an order if a product is out of stock, the price was shown incorrectly, your pincode cannot be served, or we cannot verify the order. If this happens, we will tell you, and any payment you made will be refunded in full.</p>

      <h2>4. Refunds for cancelled orders</h2>
      <ul>
        <li><b>Paid online:</b> the full amount is refunded to your original payment method within {SITE.refundTime}.</li>
        <li><b>Cash on Delivery:</b> you have not paid anything yet, so there is nothing to refund.</li>
      </ul>

      <h2>5. Contact</h2>
      <Contact />
    </>
  );
}

function Terms() {
  return (
    <>
      <p>By using this website and placing an order, you agree to these terms. Please read them along with our <Link to="/policy/privacy-policy">Privacy Policy</Link>, <Link to="/policy/shipping-and-delivery">Shipping and Delivery</Link>, <Link to="/policy/refund-policy">Refund and Return</Link> and <Link to="/policy/cancellation-policy">Cancellation</Link> policies.</p>

      <h2>1. About us</h2>
      <p>This website is operated by {SITE.legalName}, {SITE.address}.</p>

      <h2>2. Your account</h2>
      <p>You must give correct information and keep your password private. You are responsible for activity on your account. Tell us at once if you think someone else has used it.</p>

      <h2>3. Products and information</h2>
      <p>We try to show our products, photos and descriptions accurately, but colour, packaging and appearance can differ slightly. Herbs and natural products can vary from batch to batch.</p>
      <p><b>Health disclaimer:</b> information on this website is for general awareness only. It is not medical advice, and our products are not medicines meant to diagnose, treat or cure any disease. Please talk to a qualified doctor before using any herb, especially if you are pregnant, breastfeeding, have a medical condition or take regular medication.</p>

      <h2>4. Prices and availability</h2>
      <p>All prices are in Indian Rupees (₹) and include applicable taxes unless stated otherwise. Prices and stock can change without notice. If a price or listing contains an obvious error, we may cancel the order and refund any payment.</p>

      <h2>5. Orders and payment</h2>
      <p>Your order is a request to buy. We confirm it once payment is verified (or, for Cash on Delivery, once the order is placed), and we may decline or cancel an order for reasons such as stock, pricing errors or suspected misuse. Online payments are handled by Razorpay. Cash on Delivery is available on orders placed through this website.</p>

      <h2>6. Shipping, cancellations and refunds</h2>
      <p>These are covered in our Shipping and Delivery, Cancellation and Refund and Return policies, which form part of these terms.</p>

      <h2>7. Acceptable use</h2>
      <p>You agree not to misuse the website: no hacking, scraping, placing fake orders, uploading harmful code, or using the site for anything unlawful.</p>

      <h2>8. Our content</h2>
      <p>The text, logo, images and design on this website belong to {SITE.legalName} or its licensors. You may not copy or reuse them without our written permission.</p>

      <h2>9. Limits on our responsibility</h2>
      <p>To the extent the law allows, we are not liable for indirect or consequential loss arising from use of the website or products. Our total liability for any order is limited to the amount you paid for that order. Nothing here limits any right you have under Indian consumer protection law.</p>

      <h2>10. Governing law</h2>
      <p>These terms are governed by the laws of India. Courts in {SITE.jurisdiction} have jurisdiction over any dispute, subject to your rights under applicable consumer law.</p>

      <h2>11. Changes</h2>
      <p>We may update these terms from time to time. The date at the top shows the latest version. Continuing to use the website means you accept the updated terms.</p>

      <h2>12. Contact and grievances</h2>
      <p>{SITE.grievance.name}, {SITE.grievance.designation}<br />Email: <a href={`mailto:${SITE.grievance.email}`}>{SITE.grievance.email}</a></p>
    </>
  );
}

export const POLICIES = {
  'privacy-policy': { title: 'Privacy Policy', description: 'How Vedvisha Naturals collects, uses and protects your personal information.', Body: Privacy },
  'shipping-and-delivery': { title: 'Shipping and Delivery', description: 'Shipping charges, delivery times and tracking at Vedvisha Naturals.', Body: Shipping },
  'refund-policy': { title: 'Refund and Return Policy', description: 'When and how you can get a replacement or refund at Vedvisha Naturals.', Body: Refund },
  'cancellation-policy': { title: 'Cancellation Policy', description: 'How to cancel an order at Vedvisha Naturals.', Body: Cancellation },
  'terms-and-conditions': { title: 'Terms and Conditions', description: 'The terms for using the Vedvisha Naturals website and placing orders.', Body: Terms },
};