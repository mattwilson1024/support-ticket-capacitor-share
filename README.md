# Example reproduction for @capacitor/share question

This is a small example project, where the intention is to generate a PDF file and then use @capacitor/share to open the share sheet and share the created file with whichever app the user selects.

The code can be found in `src/app/home/home.page.ts`. It does the following:
- generates a PDF using `pdfmake`
- writes the generated PDF file to storage using `@capacitor/filesystem` and gets the URI (a file:// URI)
- shares the generated file using `@capacitor/share`

Run `yarn start:android` to run this on an attached Android device.

The share sheet launches and works great if you select Gmail, Google Drive etc. The generated file is made available to the selected app and attached to an email or uploaded into Google Drive etc.

However, if you select a Whatsapp recipient, then it launches WhatsApp but you only get the **text**, and not the file attachment.
