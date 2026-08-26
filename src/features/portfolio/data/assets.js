// Central asset manifest.
//
// None of these images exist yet (design.md section 20). Nothing here points at
// inspiration/, which is read-only reference material and must never be shipped
// as a site asset (rule.md Rule 1), and no remote placeholder service is used.
//
// Every consumer treats null as "render a neutral local frame at the correct
// aspect ratio", so the layout is already correct and dropping a real file into
// src/assets/images/ and naming it here is the only change needed.
//
// Suggested locations when the real files arrive:
//   src/assets/images/portrait/portrait.webp    background-removed cutout
//   src/assets/images/contact/sky.webp          soft high-key sky
//   src/assets/images/portrait/avatar.webp      square crop for the footer pill
export const assets = {
  // Hero cutout. Bottom-anchored, roughly 3:4, desaturated.
  portrait: null,
  portraitAlt: 'Vishnu Bhardwaj',
  // Footer name pill.
  avatar: null,
  // Contact section background. While null, the .sky-wash CSS approximation in
  // src/styles/index.css stands in for it.
  contactBackground: null,
};

export default assets;
