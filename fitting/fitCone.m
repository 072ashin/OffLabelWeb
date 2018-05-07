function [dx, dy, dz, px, py, pz, w] = fitCone(P, dx, dy, dz, px, py, pz, w)
% Fit a cone to n 3D-points in P given the initial estimate of it
% Input: P, x, y, z, r
%     P : list of 3D-points, is of size n * 3
%     dx, dy, dz : the cone's axis
%     px, py, pz : the cone's apex
%     w : the cone's opening angle
% Output: dx, dy, dz, px, py, pz, w
    cone_axis = [dx, dy, dz];
    cone_apex = [px, py, pz];
    cone_angle = w;
    p0 = cone_apex + cone_axis * dot(-cone_apex, cone_axis, 2);
    p0p1 = sqrt(p0 * p0') * tan(cone_angle);
    p1 = p0 + cone_axis * p0p1;
    if ((p1 - cone_apex) * (p1 - cone_apex)' < (p0 - cone_apex) * (p0 - cone_apex)')
        p1 = p0 - cone_axis * p0p1;
    end
    n = p1;
    rho = sqrt((cross(-cone_apex, cone_axis, 2)) * (cross(-cone_apex, cone_axis, 2))') * cos(cone_angle) - abs(dot(-cone_apex, cone_axis, 2)) * sin(cone_angle);
    norm_n = sqrt(n * n');
    n = n / norm_n;
    k = 1 / (norm_n - rho);
    phi = atan2(n(2), n(1));
    zeta = acos(n(3));
    sigma = atan2(cone_axis(2), cone_axis(1));
    tau = acos(cone_axis(3));
    options = optimset('Jacobian', 'on', 'Algorithm', 'trust-region-reflective', 'display', 'off');
    out = lsqnonlin(@(x)distance2cone(x, P), [rho phi zeta sigma tau k], [-Inf -pi 0 -pi 0 0], [Inf pi pi pi pi Inf], options);
    rho = out(1); phi = out(2); zeta = out(3); sigma = out(4); tau = out(5); k = out(6);
    n(1) = cos(phi) * sin(zeta);
    n(2) = sin(phi) * sin(zeta);
    n(3) = cos(zeta);
    cone_axis(1) = cos(sigma) * sin(tau);
    cone_axis(2) = sin(sigma) * sin(tau);
    cone_axis(3) = cos(tau);
    cone_apex = n * (rho + 1 / k) - cone_axis / (k * dot(n, cone_axis, 2));
    cone_angle = asin(abs(dot(n, cone_axis, 2)));
    dx = cone_axis(1); dy = cone_axis(2); dz = cone_axis(3);
    px = cone_apex(1); py = cone_apex(2); pz = cone_apex(3);
    w = cone_angle;
end
