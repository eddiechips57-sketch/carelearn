-- Link remaining ebook HTML files to their database records
UPDATE ebooks
SET pdf_url = '/ebooks/when_every_bite_matters_14_99_complete_ebook_printable_mealtime_toolkit.html'
WHERE slug = 'when-every-bite-matters';

UPDATE ebooks
SET pdf_url = '/ebooks/the_family_care_organiser_15_99_complete_ebook_printable_family_care_toolkit.html'
WHERE slug = 'family-care-organiser';

UPDATE ebooks
SET pdf_url = '/ebooks/finding_funding_care_19_99_complete_ebook_printable_funding_toolkit.html'
WHERE slug = 'finding-and-funding-care';

UPDATE ebooks
SET pdf_url = '/ebooks/101_meaningful_days_12_99_complete_ebook_printable_activity_toolkit.html'
WHERE slug = '101-meaningful-days';

UPDATE ebooks
SET pdf_url = '/ebooks/running_on_empty_13_99_complete_ebook_printable_wellbeing_toolkit.html'
WHERE slug = 'running-on-empty';

UPDATE ebooks
SET pdf_url = '/ebooks/the_ultimate_caregiver_binder_9_99_complete_ebook_printable_binder_template.html'
WHERE slug = 'ultimate-caregiver-binder';
