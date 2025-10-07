import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { corporateEventSchema } from '@/lib/validation/schemas';
import { useState } from 'react';

export default function CorporateEventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(corporateEventSchema),
    defaultValues: {
      eventType: 'corporate',
      title: '',
      description: '',
      date: new Date(),
      time: '',
      location: '',
      theme: 'professional',
      visibility: 'public',
      maxGuests: 100,
      extraFields: {
        organizationName: '',
        agenda: '',
        speakerList: [],
        sponsorList: [],
      },
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // This would be connected to your Firebase functions
      console.log('Form data submitted:', data);
      // await createEvent(data);
      // redirect('/dashboard/events');
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Corporate Event</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Name
          </label>
          <input
            {...register('extraFields.organizationName')}
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-800"
            placeholder="Enter organization name"
          />
          {errors.extraFields?.organizationName?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.extraFields.organizationName.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Title
          </label>
          <input
            {...register('title')}
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-800"
            placeholder="Enter event title"
          />
          {errors.title?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Enter event description"
          />
          {errors.description?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <input
                  type="date"
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    field.onChange(date);
                  }}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              )}
            />
            {errors.date?.message && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              {...register('time')}
              type="time"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
            {errors.time?.message && (
              <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            {...register('location')}
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Enter event location"
          />
          {errors.location?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agenda
          </label>
          <textarea
            {...register('extraFields.agenda')}
            rows={6}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Enter event agenda"
          />
          {errors.extraFields?.agenda?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.extraFields.agenda.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Speakers (one per line)
          </label>
          <textarea
            {...register('extraFields.speakerList')}
            rows={3}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Enter speakers (one per line)"
          />
          {errors.extraFields?.speakerList?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.extraFields.speakerList.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sponsors (one per line)
          </label>
          <textarea
            {...register('extraFields.sponsorList')}
            rows={3}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Enter sponsors (one per line)"
          />
          {errors.extraFields?.sponsorList?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.extraFields.sponsorList.message as string}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Style
            </label>
            <select
              {...register('theme')}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="professional">Professional</option>
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
              <option value="tech">Tech</option>
            </select>
            {errors.theme?.message && (
              <p className="mt-1 text-sm text-red-600">{errors.theme.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Guests
            </label>
            <input
              {...register('maxGuests', { valueAsNumber: true })}
              type="number"
              min={1}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
            {errors.maxGuests?.message && (
              <p className="mt-1 text-sm text-red-600">{errors.maxGuests.message as string}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Visibility
          </label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                {...register('visibility')}
                id="public"
                value="public"
                type="radio"
                className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="public" className="ml-2 block text-sm text-gray-700">
                Public
              </label>
            </div>
            <div className="flex items-center">
              <input
                {...register('visibility')}
                id="private"
                value="private"
                type="radio"
                className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="private" className="ml-2 block text-sm text-gray-700">
                Private
              </label>
            </div>
          </div>
          {errors.visibility?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.visibility.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image / Logo
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="cover-image"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="cover-image"
                    name="coverImage"
                    type="file"
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}