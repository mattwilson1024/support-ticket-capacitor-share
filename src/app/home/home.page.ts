import { Component } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Platform } from '@ionic/angular';
import pdfMake, { TCreatedPdf } from 'pdfmake/build/pdfmake';
import { Content, StyleDictionary } from 'pdfmake/interfaces';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public createdFileUri: string = null;

  constructor(
    private platform: Platform,
  ) { }

  public async onCreatePdfButtonClick(): Promise<void> {
    const pdf = this.createPdf();
    await this.saveAndOpenPdf(pdf);
  }

  private createPdf(): TCreatedPdf {
    const styles: StyleDictionary = {
      header: {
        fontSize: 24,
        bold: true,
      },
    };

    const content: Content = [
      { text: `Hello world`, style: `header` },
    ];

    return pdfMake.createPdf({
      content,
      styles,
      pageSize: `A4`,
    });
  }

  private async saveAndOpenPdf(pdf: TCreatedPdf): Promise<void> {
    try {
      const filename = `example_${Date.now()}.pdf`;
      if (this.platform.is(`cordova`)) {
        pdf.getBase64(async (base64Data) => {

          // Write the PDF to local storage
          const result = await Filesystem.writeFile({
            path: filename,
            data: base64Data,
            directory: Directory.External,
            recursive: true,
          });

          // Show the file:// URI in the UI
          this.createdFileUri = result.uri;

          // Share the file using @capacitor/share
          // Note: This works great with Gmail / Google Drive etc and attaches the PDF file, but in Whatsapp all you get
          // is the text (no file attachment)
          await Share.share({
            title: 'See cool stuff',
            text: 'Really awesome thing you need to see right meow',
            url: result.uri,
            dialogTitle: 'Share with buddies',
          });

        });
      } else {
        // On a browser simply use download
        pdf.download(filename);
      }
    } catch (err) {
      alert(err);
    }
  }

}
