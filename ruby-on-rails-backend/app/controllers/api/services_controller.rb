module Api
  class ServicesController < ApplicationController
    before_action :set_service, only: [:show, :update, :destroy]

    # GET /api/services
    def index
      @services = Service.includes(:service_translations).all
      render json: @services, include: :service_translations
    end

    # GET /api/services/:id
    def show
      render json: @service, include: :service_translations
    end

    # POST /api/services
    def create
      @service = Service.new(service_params)

      if @service.save
        render json: @service.as_json(include: :service_translations), status: :created, location: api_service_url(@service)
      else
        render json: @service.errors, status: :unprocessable_entity
      end
    end

    # PUT /api/services/:id
    def update
      if @service.update(service_params)
        render json: @service, include: :service_translations
      else
        render json: @service.errors, status: :unprocessable_entity
      end
    end

    # DELETE /api/services/:id
    def destroy
      @service.destroy
    end

    private

    def set_service
      @service = Service.find(params[:id])
    end

    def service_params
      params.require(:service).permit(
        :slug,
        service_translations_attributes: [:id, :locale, :title, :description, :image_url]
      )
    end
  end
end