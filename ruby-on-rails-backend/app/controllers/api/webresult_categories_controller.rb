module Api
  class WebresultCategoriesController < ApplicationController
    before_action :set_webresult_category, only: [:show, :update, :destroy]

    # GET /api/webresult_categories
    def index
      @categories = WebresultCategory.includes(:webresult_category_details)
                                   .order('webresult_category_details.position ASC')
      render json: @categories, include: :webresult_category_details
    end

    # GET /api/webresult_categories/:id
    def show
      render json: @webresult_category, include: :webresult_category_details
    end

    # POST /api/webresult_categories
    def create
      @webresult_category = WebresultCategory.new(webresult_category_params)

      if @webresult_category.save
        render json: @webresult_category.as_json(include: :webresult_category_details), 
               status: :created
      else
        render json: { errors: @webresult_category.errors.full_messages }, 
               status: :unprocessable_entity
      end
    end

    # PUT /api/webresult_categories/:id
    def update
      if @webresult_category.update(webresult_category_params)
        render json: @webresult_category, include: :webresult_category_details
      else
        render json: { errors: @webresult_category.errors.full_messages }, 
               status: :unprocessable_entity
      end
    end

    # DELETE /api/webresult_categories/:id
    def destroy
      if @webresult_category.destroy
        head :no_content
      else
        render json: { errors: @webresult_category.errors.full_messages }, 
               status: :unprocessable_entity
      end
    end

    # POST /api/webresult_categories/update_positions
    def update_positions
      ActiveRecord::Base.transaction do
        params[:positions].each do |position_update|
          detail = WebresultCategoryDetail.find(position_update[:id])
          detail.update!(position: position_update[:position])
        end
        
        head :ok
      end
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.full_messages }, 
             status: :unprocessable_entity
    rescue ActiveRecord::RecordNotFound => e
      render json: { errors: ['Record not found'] }, 
             status: :not_found
    rescue StandardError => e
      render json: { errors: [e.message] }, 
             status: :internal_server_error
    end

    # POST /api/webresult_categories/:id/update_detail
    def update_detail
      @detail = WebresultCategoryDetail.find(params[:detail_id])
      
      if @detail.update(detail_params)
        render json: @detail
      else
        render json: { errors: @detail.errors.full_messages }, 
               status: :unprocessable_entity
      end
    rescue ActiveRecord::RecordNotFound
      render json: { errors: ['Detail not found'] }, 
             status: :not_found
    end

    # POST /api/webresult_categories/create_with_translations
    def create_with_translations
      ActiveRecord::Base.transaction do
        @category = WebresultCategory.create!(
          category_name_en: params[:category_name_en],
          category_name_jp: params[:category_name_jp]
        )

        # Create English translation
        @category.webresult_category_details.create!(
          locale: 'en',
          company_name: params[:en_company_name],
          service_name: params[:en_service_name],
          details: params[:en_details],
          image_url: params[:image_url],
          slug: params[:slug]
        )

        # Create Japanese translation
        @category.webresult_category_details.create!(
          locale: 'jp',
          company_name: params[:jp_company_name],
          service_name: params[:jp_service_name],
          details: params[:jp_details],
          image_url: params[:image_url],
          slug: params[:slug]
        )

        render json: @category, 
               include: :webresult_category_details, 
               status: :created
      end
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.full_messages }, 
             status: :unprocessable_entity
    end

    private

    def set_webresult_category
      @webresult_category = WebresultCategory.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { errors: ['Category not found'] }, 
             status: :not_found
    end

    def webresult_category_params
      params.require(:webresult_category).permit(
        :category_name_en,
        :category_name_jp,
        webresult_category_details_attributes: [
          :id,
          :locale,
          :company_name,
          :service_name,
          :details,
          :image_url,
          :slug,
          :position,
          :_destroy
        ]
      )
    end

    def detail_params
      params.require(:detail).permit(
        :company_name,
        :service_name,
        :details,
        :image_url,
        :slug,
        :position
      )
    end
  end
end
