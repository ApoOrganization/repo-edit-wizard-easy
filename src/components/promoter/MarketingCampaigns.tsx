import React, { useState } from 'react';
import { Calendar, Target, Users, TrendingUp, ExternalLink, Filter, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { usePromoterCampaigns } from '@/hooks/usePromoterCampaigns';
import { PromoterMetaCampaign } from '@/types/promoter.types';

interface MarketingCampaignsProps {
  promoterId: string;
  isLoading?: boolean;
}

const MarketingCampaigns: React.FC<MarketingCampaignsProps> = ({ 
  promoterId, 
  isLoading: externalLoading = false 
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedCaption, setExpandedCaption] = useState<number | null>(null);

  const { data: campaignsData, isLoading, error } = usePromoterCampaigns(
    promoterId,
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );

  const getStatusBadgeVariant = (status: string | null) => {
    if (!status) return 'secondary';
    switch (status.toLowerCase()) {
      case 'active':
        return 'default';
      case 'paused':
        return 'secondary';
      case 'ended':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPageNames = (pageNames: string[] | null) => {
    if (!pageNames || pageNames.length === 0) return 'Unknown Page';
    if (pageNames.length === 1) return pageNames[0];
    return `${pageNames[0]} +${pageNames.length - 1} more`;
  };

  const truncateCaption = (caption: string | null, maxLength: number = 100) => {
    if (!caption) return 'No caption available';
    if (caption.length <= maxLength) return caption;
    return caption.substring(0, maxLength) + '...';
  };

  const uniqueStatuses = campaignsData?.campaigns
    ? Array.from(new Set(campaignsData.campaigns.map(c => c.ad_status).filter(Boolean)))
    : [];

  if (isLoading || externalLoading) {
    return (
      <div className="space-y-6">
        {/* Loading Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="h-8 w-16 bg-muted rounded animate-pulse mx-auto" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse mx-auto" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Loading Campaigns */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <Target className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <h3 className="font-medium text-red-800 mb-2">Unable to Load Campaign Data</h3>
            <p className="text-sm text-red-700 mb-4">
              {error instanceof Error ? error.message : 'Failed to fetch marketing campaigns'}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!campaignsData || campaignsData.campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Target className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No Marketing Campaigns</h3>
            <p className="text-sm text-muted-foreground">
              This promoter doesn't have any Meta Ads campaigns on record.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{campaignsData.summary.total_campaigns}</div>
              <p className="text-xs text-muted-foreground">Total Campaigns</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{campaignsData.summary.active_campaigns}</div>
              <p className="text-xs text-muted-foreground">Active Campaigns</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{campaignsData.summary.unique_pages}</div>
              <p className="text-xs text-muted-foreground">Unique Pages</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {campaignsData.summary.date_range.earliest_start && campaignsData.summary.date_range.latest_end
                  ? Math.ceil((new Date(campaignsData.summary.date_range.latest_end).getTime() - 
                              new Date(campaignsData.summary.date_range.earliest_start).getTime()) / 
                              (1000 * 60 * 60 * 24))
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Days Coverage</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by Status:</span>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {uniqueStatuses.map(status => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaignsData.campaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-semibold">
                      {formatPageNames(campaign.page_name)}
                    </CardTitle>
                    <Badge variant={getStatusBadgeVariant(campaign.ad_status)}>
                      {campaign.ad_status || 'Unknown'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDate(campaign.ad_start_date)} - {formatDate(campaign.ad_end_date)}
                      </span>
                    </div>
                    {campaign.ad_archive_id && (
                      <div className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        <span>Archive ID: {campaign.ad_archive_id}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {/* Caption */}
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Ad Caption</h4>
                  <p className="text-sm">
                    {expandedCaption === campaign.id 
                      ? campaign.ad_caption || 'No caption available'
                      : truncateCaption(campaign.ad_caption)
                    }
                  </p>
                  {campaign.ad_caption && campaign.ad_caption.length > 100 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 mt-2 text-xs"
                      onClick={() => setExpandedCaption(
                        expandedCaption === campaign.id ? null : campaign.id
                      )}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      {expandedCaption === campaign.id ? 'Show Less' : 'Show More'}
                    </Button>
                  )}
                </div>

                {/* Page Names (if multiple) */}
                {campaign.page_name && campaign.page_name.length > 1 && (
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">All Pages</h4>
                    <div className="flex flex-wrap gap-1">
                      {campaign.page_name.map((page, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {page}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Date Range Summary */}
      {campaignsData.summary.date_range.earliest_start && campaignsData.summary.date_range.latest_end && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-medium text-foreground mb-2">Campaign Timeline</h3>
              <p className="text-sm text-muted-foreground">
                From {formatDate(campaignsData.summary.date_range.earliest_start)} to{' '}
                {formatDate(campaignsData.summary.date_range.latest_end)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketingCampaigns;