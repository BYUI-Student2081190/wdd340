-- Insert data for Tony Stark into the `account` table
INSERT INTO public.account(
	account_firstname,
	account_lastname,
	account_email,
	account_password
	)
	VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Update the data for Tony Stark in the `account` table
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Delete the data for Tony Stark in the `account` table
DELETE FROM public.account
WHERE account_id = 1;

-- Update the GM Hammer data in the `inventory` table
UPDATE public.inventory
SET inv_description = replace(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;

-- Select the data from the `inventory` and `classification` tables
SELECT inv_make, inv_model, classification_name
FROM public.inventory as i
	INNER JOIN public.classification as c
		ON i.classification_id = c.classification_id
WHERE classification_name = 'Sports';

-- Update the data for inv_image and inv_thumbnail in the `inventory` table
UPDATE public.inventory
SET
	inv_image = replace(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = replace(inv_thumbnail, '/images', '/images/vehicles');