-- Link ebook HTML files to their database records so buyers can read them
UPDATE ebooks
SET pdf_url = '/ebooks/beyond_words_14_99_complete_ebook_printable_communication_toolkit.html'
WHERE slug = 'beyond-words';

UPDATE ebooks
SET pdf_url = '/ebooks/the_first_30_days_home_18_99_complete_ebook_printable_hospital_to_home_toolkit.html'
WHERE slug = 'first-30-days-home';

UPDATE ebooks
SET pdf_url = '/ebooks/living_well_with_dementia_at_home_17_99_complete_ebook_printable_dementia_toolkit.html'
WHERE slug = 'living-well-with-dementia';

UPDATE ebooks
SET pdf_url = '/ebooks/safe_hands_16_99_complete_ebook_printable_mobility_toolkit.html'
WHERE slug = 'safe-hands-mobility';
