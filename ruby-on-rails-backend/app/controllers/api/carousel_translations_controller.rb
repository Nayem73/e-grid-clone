module Api
  class CarouselTranslationsController < ApplicationController
    # GET /api/carousel_translations
    # GET /api/carousel_translations?locale=en
    def index
      if params[:locale]
        translation = CarouselTranslation.find_by(locale: params[:locale])
        if translation
          render json: {
            locale: translation.locale,
            title: translation.title,
            description: translation.description
          }
        else
          render json: { error: 'Translation not found' }, status: :not_found
        end
      else
        @carousel_translations = CarouselTranslation.all
        render json: @carousel_translations
      end
    end

    # GET /api/carousel_translations/:id
    def show
      @carousel_translation = CarouselTranslation.find(params[:id])
      render json: @carousel_translation
    end

    # POST /api/carousel_translations
    def create
      @carousel_translation = CarouselTranslation.new(carousel_translation_params)

      if @carousel_translation.save
        render json: @carousel_translation, status: :created, location: api_carousel_translation_url(@carousel_translation)
      else
        render json: @carousel_translation.errors, status: :unprocessable_entity
      end
    end

    # PUT /api/carousel_translations/:id
    def update
      @carousel_translation = CarouselTranslation.find(params[:id])

      if @carousel_translation.update(carousel_translation_params)
        render json: @carousel_translation
      else
        render json: @carousel_translation.errors, status: :unprocessable_entity
      end
    end

    # DELETE /api/carousel_translations/:id
    def destroy
      @carousel_translation = CarouselTranslation.find(params[:id])
      @carousel_translation.destroy
    end

    private

    def carousel_translation_params
      params.require(:carousel_translation).permit(:locale, :title, :description)
    end
  end
end
