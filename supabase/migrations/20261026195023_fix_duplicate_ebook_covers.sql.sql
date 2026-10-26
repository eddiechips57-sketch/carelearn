-- Fix duplicate cover images with unique, relevant photos
UPDATE ebooks SET cover_image_url = 'https://images.pexels.com/photos/6753451/pexels-photo-6753451.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE slug = 'first-30-days-home';
UPDATE ebooks SET cover_image_url = 'https://images.pexels.com/photos/6837644/pexels-photo-6837644.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE slug = 'running-on-empty';
UPDATE ebooks SET cover_image_url = 'https://images.pexels.com/photos/5790821/pexels-photo-5790821.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE slug = 'visual-home-care-sign-pack';
UPDATE ebooks SET cover_image_url = 'https://images.pexels.com/photos/32081457/pexels-photo-32081457.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE slug = 'about-me-care-passport';
