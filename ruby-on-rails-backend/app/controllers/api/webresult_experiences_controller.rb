module Api
  class WebresultExperiencesController < ApplicationController
    # GET /api/webresult_experiences
    # GET /api/webresult_experiences?locale=en
    def index
      if params[:locale]
        experience = WebresultExperience.find_by(locale: params[:locale])
        if experience
          render json: {
            locale: experience.locale,
            title: experience.marketing_title,
            description: experience.description
          }
        else
          render json: { error: 'Experience not found' }, status: :not_found
        end
      else
        @webresult_experiences = WebresultExperience.all
        render json: @webresult_experiences
      end
    end

    # GET /api/webresult_experiences/:id
    def show
      @webresult_experience = WebresultExperience.find(params[:id])
      render json: @webresult_experience
    end

    # POST /api/webresult_experiences
    def create
      @webresult_experience = WebresultExperience.new(webresult_experience_params)

      if @webresult_experience.save
        render json: @webresult_experience, status: :created, location: api_webresult_experience_url(@webresult_experience)
      else
        render json: @webresult_experience.errors, status: :unprocessable_entity
      end
    end

    # PUT /api/webresult_experiences/:id
    def update
      @webresult_experience = WebresultExperience.find(params[:id])

      if @webresult_experience.update(webresult_experience_params)
        render json: @webresult_experience
      else
        render json: @webresult_experience.errors, status: :unprocessable_entity
      end
    end

    # DELETE /api/webresult_experiences/:id
    def destroy
      @webresult_experience = WebresultExperience.find(params[:id])
      @webresult_experience.destroy
    end

    private

    def webresult_experience_params
      params.require(:webresult_experience).permit(:locale, :marketing_title, :description)
    end
  end
end