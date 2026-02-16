export interface NewsletterSubscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  interests: ("clubnieuws" | "ploegnieuws" | "evenementen" | "jeugd")[];
  subscribedAt: string;
}

export const newsletterBenefits = [
  {
    icon: "newspaper",
    title: "Wekelijks nieuws",
    description: "Ontvang elke week het laatste clubnieuws in je mailbox"
  },
  {
    icon: "trophy", 
    title: "Ploegupdates",
    description: "Volg je favoriete ploeg met wedstrijdverslagen en uitslagen"
  },
  {
    icon: "calendar",
    title: "Evenementen",
    description: "Blijf op de hoogte van komende activiteiten en evenementen"
  },
  {
    icon: "users",
    title: "Jeugdnieuws",
    description: "Speciale updates voor ouders en jeugdleden"
  }
];
