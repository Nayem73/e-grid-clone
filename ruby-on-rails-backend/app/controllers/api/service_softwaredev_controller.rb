module Api
  class ServiceSoftwaredevController < ApplicationController
    # GET /api/service_softwaredev
    # GET /api/service_softwaredev?locale=en
    def index
      if params[:locale]
        translation = ServiceSoftwaredev.find_by(locale: params[:locale])
        if translation
          render json: {
            locale: translation.locale,
            description: translation.description,
            main_dev_language_1: translation.main_dev_language_1,
            main_dev_language_2: translation.main_dev_language_2,
            image_url: translation.image_url,
            others: translation.others,
            contact_form: translation.contact_form
          }
        else
          render json: { error: 'Translation not found' }, status: :not_found
        end
      else
        @service_softwaredev = ServiceSoftwaredev.all
        render json: @service_softwaredev
      end
    end

    # GET /api/service_softwaredev/:id
    def show
      @service_softwaredev = ServiceSoftwaredev.find(params[:id])
      render json: @service_softwaredev
    end

    # POST /api/service_softwaredev
    def create
      @service_softwaredev = ServiceSoftwaredev.new(service_softwaredev_params)

      if @service_softwaredev.save
        render json: @service_softwaredev, status: :created, location: api_service_softwaredev_url(@service_softwaredev)
      else
        render json: @service_softwaredev.errors, status: :unprocessable_entity
      end
    end

    # PUT /api/service_softwaredev/:id
    def update
      @service_softwaredev = ServiceSoftwaredev.find(params[:id])

      if @service_softwaredev.update(service_softwaredev_params)
        render json: @service_softwaredev
      else
        render json: @service_softwaredev.errors, status: :unprocessable_entity
      end
    end

    # DELETE /api/service_softwaredev/:id
    def destroy
      @service_softwaredev = ServiceSoftwaredev.find(params[:id])
      @service_softwaredev.destroy
    end

    private

    def service_softwaredev_params
      params.require(:service_softwaredev).permit(
        :locale,
        :description,
        :main_dev_language_1,
        :main_dev_language_2,
        :image_url,
        :others,
        :contact_form
      )
    end
  end
end
