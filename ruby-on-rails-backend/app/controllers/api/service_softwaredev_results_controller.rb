module Api
  class ServiceSoftwaredevResultsController < ApplicationController
    before_action :set_service_softwaredev_result, only: [:show, :update, :destroy]

    # GET /api/service_softwaredev_results
    def index
      @results = ServiceSoftwaredevResult.includes(:service_softwaredev_result_details).all
      render json: @results, include: :service_softwaredev_result_details
    end

    # GET /api/service_softwaredev_results/:id
    def show
      render json: @service_softwaredev_result, include: :service_softwaredev_result_details
    end

    # POST /api/service_softwaredev_results
    def create
      @service_softwaredev_result = ServiceSoftwaredevResult.new(service_softwaredev_result_params)

      if @service_softwaredev_result.save
        render json: @service_softwaredev_result.as_json(include: :service_softwaredev_result_details), status: :created
      else
        render json: @service_softwaredev_result.errors, status: :unprocessable_entity
      end
    end

    # PUT /api/service_softwaredev_results/:id
    def update
      if @service_softwaredev_result.update(service_softwaredev_result_params)
        render json: @service_softwaredev_result, include: :service_softwaredev_result_details
      else
        render json: @service_softwaredev_result.errors, status: :unprocessable_entity
      end
    end

    # DELETE /api/service_softwaredev_results/:id
    def destroy
      @service_softwaredev_result.destroy
    end

    private

    def set_service_softwaredev_result
      @service_softwaredev_result = ServiceSoftwaredevResult.find(params[:id])
    end

    def service_softwaredev_result_params
      params.require(:service_softwaredev_result).permit(
        service_softwaredev_result_details_attributes: [:id, :locale, :system_name, :language, :scope, :_destroy]
      )
    end
  end
end
