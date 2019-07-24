export class Tab {
  constructor(listingID: string, scrollY: number) {
    this.listingID = listingID;
    this.scrollY = scrollY;
  }

  listingID: string;
  scrollY: number;
}
