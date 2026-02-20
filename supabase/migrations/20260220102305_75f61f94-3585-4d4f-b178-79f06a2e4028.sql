
-- Add status column to bookings
ALTER TABLE public.bookings ADD COLUMN status text NOT NULL DEFAULT 'pending';

-- Allow admins to update bookings (for status changes)
CREATE POLICY "Admins can update bookings"
ON public.bookings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow anyone to read feedback (for public testimonials)
CREATE POLICY "Anyone can view feedback"
ON public.feedback
FOR SELECT
USING (true);
