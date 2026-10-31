import homeSafetyChecklist from '../assets/ebook-covers/home-safety-checklist-dementia.jpg';
import calmInTheStorm from '../assets/ebook-covers/calm-in-the-storm.jpg';
import firstThirtyDaysHome from '../assets/ebook-covers/first-30-days-home.jpg';
import livingWellWithDementia from '../assets/ebook-covers/living-well-with-dementia.jpg';
import safeHandsMobility from '../assets/ebook-covers/safe-hands-mobility.jpg';
import whenEveryBiteMatters from '../assets/ebook-covers/when-every-bite-matters.jpg';
import ultimateCaregiverBinder from '../assets/ebook-covers/ultimate-caregiver-binder.jpg';
import aboutMeCarePassport from '../assets/ebook-covers/about-me-care-passport.jpg';

const bundledCovers: Record<string, string> = {
  'home-safety-checklist-dementia': homeSafetyChecklist,
  'calm-in-the-storm': calmInTheStorm,
  'first-30-days-home': firstThirtyDaysHome,
  'living-well-with-dementia': livingWellWithDementia,
  'safe-hands-mobility': safeHandsMobility,
  'when-every-bite-matters': whenEveryBiteMatters,
  'ultimate-caregiver-binder': ultimateCaregiverBinder,
  'about-me-care-passport': aboutMeCarePassport,
};

export function getEbookCoverUrl(slug: string, databaseUrl: string | null): string | null {
  return bundledCovers[slug] || databaseUrl;
}
